let ModbusRTU = require("modbus-serial");

const address = "/dev/tty.usbserial-A10LKGM2";
const startAddress = 0;
const quantity = 8;
const { saveModbusData } = require("./database");

// fungsi untuk memmbaca data dengan Discrete Inputs
async function readData(client, devID) {
  return new Promise((resolve, reject) => {
    const start = Date.now();

    client.setID(devID);
    client.setTimeout(100);

    client.readDiscreteInputs(startAddress, quantity, (readErr, data) => {
      let dataToSave = {};
      if (readErr) {
        console.error(`Read error for ID ${devID}:`, readErr.message);

        dataToSave = {
          data: "",
          status: 0,
          deviceID: devID,
          message: readErr.message,
        };
        reject();
      } else {
        let binary = data?.data?.map((value) => (value ? 1 : 0)).join("");
        console.log(`Data ID ${devID}:`, binary);

        dataToSave = {
          data: binary,
          status: 1,
          deviceID: devID,
          message: "success read data"
        };

        resolve(binary);
      }

      const end = Date.now();
      const duration = end - start;

      saveModbusData({ ...dataToSave, captureTime: duration });

      console.log(`Membaca ID ${devID} Dalam: ${duration}ms`);
      console.log(`--------------------------`);
    });
  });
}

async function connectModbus(client) {
  await new Promise((resolve, reject) => {
    const start = Date.now();

    client.connectRTUBuffered(address, { baudRate: 9600 }, (err) => {
      if (err) {
        console.error("Connection error:", err.message);
        saveModbusData("Conn Error", err.message);
        reject(err);
      } else {
        resolve();
      }
    });

    const end = Date.now();
    const duration = end - start;

    console.log(`Koneksi Dalam: ${duration}ms`);
    console.log(`--------------------------`);
  });
}

async function main() {
  let client = new ModbusRTU();

  try {
    const start = Date.now();

    await connectModbus(client);
    await readData(client, 1);
    await readData(client, 2);

    const end = Date.now();
    const elapsed = end - start;
    const remainingTime = 1000 - elapsed;

    if (remainingTime > 0) {
      console.log(`Waktu Terpakai ${elapsed}ms`);
      console.log(`Sisa Waktu ${remainingTime}ms`);
      console.log("==========================");
      await new Promise((resolve) => setTimeout(resolve, remainingTime));
    }

    client.close(() => {
      main();
    });
  } catch (error) {
    console.error("Error:", error);
    client.close(()=>{
      main();
    })
  }
}

main();

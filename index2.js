let ModbusRTU = require("modbus-serial");

const address = "COM3";
const startAddress = 0;
const quantity = 8;
const { saveModbusData } = require("./database");

// fungsi untuk memmbaca data dengan Discrete Inputs
async function readData(client, id) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    client.setID(id);
    client.setTimeout(1000);
    client.readDiscreteInputs(startAddress, quantity, (readErr, data) => {
      if (readErr) {
        console.error(`Read error for ID ${id}:`, readErr.message);
        saveModbusData(`Read Error ${id}`, readErr.message);
      } else {
        let binary = data?.data?.map((value) => (value ? 1 : 0)).join("");
        console.log(`Success Read ${id}:`, binary);
        saveModbusData(`Success ${id}`, "Success Save Data", binary);

        resolve(binary);
      }
      const end = Date.now();
      const duration = end - start;
      console.log(`Membaca ID ${id} Dalam: ${duration}ms`);
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
    console.log(`Konek Dalam: ${duration}ms`);
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
    console.error("Error:", error.message);
    client.close(() => {
      main();
    });
  }
}

main();

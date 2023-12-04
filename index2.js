let ModbusRTU = require("modbus-serial");

const address = "COM2";
const startAddress = 0;
const quantity = 8;
const { saveModbusData } = require("./database");

async function readDataWithID(client, id) {
  return new Promise((resolve, reject) => {
    const start = Date.now(); 
    client.setID(id);
    client.setTimeout(1000);
    client.readDiscreteInputs(startAddress, quantity, (readErr, data) => {
      if (readErr) {
        console.error(`Read error for ID ${id}:`, readErr.message);
        saveModbusData(`Read Error ${id}`, readErr.message);
        reject(readErr);
      } else {
        let binary = data?.data?.map((value) => (value ? 1 : 0)).join("");
        console.log(`Success Read ${id}:`, binary);
        saveModbusData(`Success ${id}`, "Success Save Data", binary);

        const end = Date.now(); 
        const duration = end - start;
        console.log(`Membaca ID ${id} Dalam: ${duration}ms`);
        resolve(binary);
      }
    });
  });
}

async function connectAndReadDataSequentially() {
  let client = new ModbusRTU();

  try {
    await new Promise((resolve, reject) => {
      client.connectRTUBuffered(address, { baudRate: 9600 }, (err) => {
        if (err) {
          console.error("Connection error:", err.message);
          saveModbusData("Conn Error", err.message);
          reject(err);
        } else {
          resolve();
        }
      });
    });

    const start = Date.now();

    await readDataWithID(client, 1);
    await readDataWithID(client, 2);
    await readDataWithID(client, 3);
    
    const end = Date.now();
    const elapsed = end - start;
    const remainingTime = 1000 - elapsed;

    if (remainingTime > 0) {
      console.log(`Sisa Waktu ${remainingTime}ms`);
      console.log("==========================");
      await new Promise((resolve) => setTimeout(resolve, remainingTime));
    }

    client.close(() => {
      connectAndReadDataSequentially();
    });
  } catch (error) {
    console.error("Error:", error.message);
  }
}

connectAndReadDataSequentially();

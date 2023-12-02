let ModbusRTU = require("modbus-serial");

const address = "COM2"; 
const unitId = 1; 
const startAddress = 0; 
const quantity = 8; 

const {saveModbusData} = require('./database');

function connectAndReadData() {
  let client = new ModbusRTU();

  
  client.connectRTUBuffered(address, { baudRate: 9600 }, (err) => {
    if (err) {
      console.error("Connection error:", err.message);
      saveModbusData('Conn Error',err.message);
    } else {
      client.setID(unitId);
      client.setTimeout(1000);

      client.readDiscreteInputs(startAddress, quantity, (readErr, data) => {
        if (readErr) {
          console.error("Read error:", readErr.message);  
          saveModbusData('Read Error',readErr.message );
        } else { 
          let binary = data?.data?.map((value) => (value ? 1 : 0)).join("");
          console.log('Succes Read :', binary);
          saveModbusData('Success','Success Save Data',binary);
        }
        client.close(() => {
          connectAndReadData();
        });
      });
    }

  });
}

connectAndReadData();

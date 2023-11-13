let ModbusRTU = require("modbus-serial");

const address = "COM3"; 
const unitId = 1; 
const startAddress = 0; 
const quantity = 8; 

function connectAndReadData() {
  let client = new ModbusRTU();

  
  client.connectRTUBuffered(address, { baudRate: 9600 }, (err) => {
    if (err) {
      console.error("Connection error:", err.message);
    } else {
      client.setID(unitId);
      client.setTimeout(1000);

      client.readDiscreteInputs(startAddress, quantity, (readErr, data) => {
        if (readErr) {
          console.error("Read error:", readErr.message);  
        } else { 
          console.log("Data:", data.data);
        }
        client.close(() => {
          
        });
      });
    }
  });
}


setInterval(connectAndReadData, 1000);

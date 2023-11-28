let ModbusRTU = require("modbus-serial");

const address = "COM2"; 
const startAddress = 0; 
const quantity = 8; 

const {saveModbusData} = require('./database');

function connectAndReadData(unitId) {
  let client = new ModbusRTU();

  
  client.connectRTUBuffered(address, { baudRate: 9200 }, (err) => {
    if (err) {
      console.error(`Connection error Slave ${unitId}:`, err.message);
      saveModbusData('Conn Error',err.message);
    } else {
      client.setID(unitId);
      client.setTimeout(100);

      client.readDiscreteInputs(startAddress, quantity, (readErr, data) => {
        if (readErr) {
          console.error(`Read error slave ${unitId}:`, readErr.message);  
          saveModbusData('Read Error',readErr.message );
        } else { 
          let binary = data?.data?.map((value) => (value ? 1 : 0)).join("");
          console.log(`Succes Read slave ${unitId}:`, binary);
          saveModbusData('Success','Success Save Data',binary);
        }
        client.close(() => {
          
        });
      });
    }
  });
}

setInterval(()=>{
  setTimeout(()=>connectAndReadData(1),100)
  setTimeout(()=>connectAndReadData(2),200);
},200)
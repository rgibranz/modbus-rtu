const ModbusRTU = require("modbus-serial");

const client = new ModbusRTU();
const SerialPort = "/dev/tty.usbserial-A10LKGM2";

const connect = async (SerialPort) => {
  if (SerialPort) {
    try {
      await client.connectRTUBuffered(SerialPort, { baudRate: 9600 });
      client.setID(1);
    } catch (err) {
      console.log(err);
    }
  }
};

let count = 1;
connect(SerialPort);

setInterval(() => {
  client.readDiscreteInputs(0, 8, (err, data) => {
    console.log(`<==== Hitung Ke ${count} ====>`);
    if (data) {
      const binaryData = data.data.map((value) => (value ? 1 : 0)).join("");
      const hex = data.buffer.toString("hex")
      console.log({hex:hex, binary:binaryData});
    } else {
      console.log(err.message);
      connect(SerialPort);
    }
    count++;
  });
}, 1000);

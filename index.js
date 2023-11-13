let ModbusRTU = require("modbus-serial");

const address = "/dev/tty.usbserial-A10LKGM2";
const unitId = 1; // Sesuaikan dengan ID unit Modbus Anda
const startAddress = 0; // Address awal yang ingin Anda baca
const quantity = 8; // Jumlah bit yang ingin Anda baca

let client = new ModbusRTU();

function connectAndReadData() {
  client.connectRTUBuffered(address, { baudRate: 9600 }, () => {
    client.setID(unitId);
    client.setTimeout(1000);
    client.readDiscreteInputs(startAddress, quantity, (err, data) => {
      if (err) {
        console.error(err.errno);
      } else {
        console.log("Data:", data.data);
        client.close(() => {
          // Proses sudah selesai, tutup koneksi
        });
      }
    });
  });
}

// Memulai proses awal
setInterval(connectAndReadData, 1000);

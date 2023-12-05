const sqlite3 = require("sqlite3").verbose();
const dbFile = __dirname + "/db/database.db";

const db = new sqlite3.Database(dbFile);

function saveModbusData(item) {
  let timestamp = Math.floor(Date.now() / 1000);
  let query = `INSERT INTO modbusData (deviceID ,data, status, message, captureTime, timestamp) 
    VALUES ( ${item.deviceID}, '${item.data}', ${item.status}, '${item.message}', '${item.captureTime}', '${timestamp}');`;

  db.run(query, function (err) {
    if (err) {
      console.error(err.message);
    }
  });
}

module.exports = { saveModbusData };

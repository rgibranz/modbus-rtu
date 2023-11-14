const sqlite3 = require('sqlite3').verbose();
const dbFile = __dirname + "/db/playlist.db";

const db = new sqlite3.Database(dbFile);


function saveModbusData(status, message, data = '-') {
    let timestamp = Math.floor(Date.now() / 1000);
    let query = `INSERT INTO modbus_data (data, status, message, timestamp) VALUES('${data}', '${status}', '${message}', '${timestamp}')`;

    db.run(query, function (err) {
        if (err) {
            console.error(err.message);
        }
    });
}

module.exports = {saveModbusData}
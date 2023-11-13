const sqlite3 = require('sqlite3').verbose();
const dbFile = __dirname + "/db/playlist.db";

const db = new sqlite3.Database(dbFile);


function saveModbusData(status,){

}

module.exports = {saveModbusData}
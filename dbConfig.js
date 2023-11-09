const sqlite3 = require('sqlite3').verbose();
const dbFile = __dirname + "/db/playlist.db";

const db = new sqlite3.Database(dbFile);

module.exports = db;
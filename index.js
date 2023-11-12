const ModbusRTU = require("modbus-serial");

const client = new ModbusRTU();
const SerialPort = "COM3";

const sqlite3 = require("sqlite3").verbose();
const dbFile = __dirname + "/db/playlist.db";
const db = new sqlite3.Database(dbFile);

const connect = async () => {
  try {
    await client.connectRTUBuffered(SerialPort, { baudRate: 9600 });
    client.setID(1);
    client.setTimeout(1000)
  } catch (err) {
    console.log(Date().toString(), " : ", err);
  }
};

const read = async () => {
  try {
    let data = await client.readDiscreteInputs(0, 8);

    const binary = data?.data?.map((value) => (value ? 1 : 0)).join("");
    const hex = data?.buffer?.toString("hex");
    client.close();
    return { hex, binary };
  } catch (err) {
    connect();
    console.log(Date().toString(), " : ", err.message);
  }
};

const saveData = (hex, biner) => {
  let query = `INSERT INTO data_modbus (hex,biner,timestamp) VALUES('${hex}','${biner}','${Math.floor(
    Date.now() / 1000
  )}')`;

  db.serialize(() => {
    db.run(query);
  });

  console.log("Data Saved", Math.floor(Date.now() / 1000));
};

setInterval(async () => {
  connect();
  let data = await read();

  if (data) {
    console.log(data);
  }
}, 1000);

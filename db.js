const sqlite3 = require("sqlite3").verbose();

function connectDatabase() {
  let db = new sqlite3.Database("./data/notes.db", err => {
    if (err) {
      console.log(err.message);
    }
    console.log(`Created new db handle! ${db}`);
  });

  db.configure("busyTimeout", 30000); // set 30 sec busy timeout
  db.run("PRAGMA journal_mode = WAL;"); // faster reads
  return db;
}

module.exports = connectDatabase();

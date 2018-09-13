// Lets cluster!
var cluster = require("cluster");

// master process
if (cluster.isMaster) {
  // DB init/connect
  let db = require("./db");

  db.run(
    "CREATE TABLE IF NOT EXISTS notes (note_id INTEGER PRIMARY KEY, title VARCHAR(255), body VARCHAR(5000))"
  );

  // reset table on startup
  db.run("delete from notes");

  // CPUs
  var cpuCount = require("os").cpus().length;

  // Create a worker for each CPU
  for (var i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }

  // handle crashed/dead worker threads
  cluster.on("exit", function(worker) {
    console.log("Worker id: %d exited", worker.id);
    cluster.fork();
  });

  // worker processes
} else {
  const express = require("express");
  const bodyParser = require("body-parser");
  const app = express();
  const port = 8000;

  // DB connect
  let db = require("./db");

  app.use(bodyParser.urlencoded({ extended: true }));

  require("./app/routes")(app, db, {});

  app.listen(port, () => {
    console.log(`Worker: ${cluster.worker.id} Listening on port: ${port}`);
  });
}

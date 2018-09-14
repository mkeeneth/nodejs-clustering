// note_routes.js

module.exports = function(app, db) {
  app.post("/noop", (req, res) => {
    // just return, for raw throughput testing
    res.status(202);
    res.send({ noop: true }).end();
  });

  app.post("/notes", (req, res) => {
    const note = { text: req.body.body, title: req.body.title };
    const sql = "INSERT INTO notes (title, body) VALUES (?,?)";

    // make sure we are not over the note count!
    db.all("SELECT count(*) as COUNT from notes", function(err, rows) {
      if (err) {
        console.error(err);
        res.status(500);
        res.send({ error: true });
      }
      if (rows[0].COUNT >= 5000) {
        res.status(418);
        res.send({ error: true, message: "over note limit!" }).end();
      } else {
        let stmt = db.prepare(sql, note.title, note.text).run((err, row) => {
          if (err) {
            console.error(err);
            res.status(500);
            res.send({ error: true });
          } else {
            res.status(202);
            res.send({ id: stmt.lastID, title: note.title, text: note.text });
          }
          res.end();
        });
      }
    });
  });
};

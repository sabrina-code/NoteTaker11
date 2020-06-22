const express = require("express");
const bodyParser = require('body-parser');
const path = require("path");
const fs = require('fs');
const db = require("./db/db.json");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/public')); //to include css

// ROUTES
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

//DATA: read, write, delete
app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) throw err;
    res.send(JSON.parse(data));
  });
});

app.post('/api/notes', (req, res) => {
  db.push(req.body); //index.js #53

  for (var i = 0; i < db.length; i++) {
    db[i]["id"] = JSON.parse(i + 1);
  };
  const notesPost = JSON.stringify(db, null, 2);
  fs.writeFile('./db/db.json', notesPost, (err, data) => {
    if (err) throw err;
    res.redirect("/notes"); //refresh the html
  });
});

app.delete('/api/notes/:id', function (req, res) {
  var id = JSON.parse(req.params.id); //delete by id -- // console.log(typeof id);

  fs.readFile("./db/db.json", 'utf8', (err, data) => {
    data = JSON.parse(data);  //all items in the json object //console.log(data);
    let newData = data.filter(note => note.id !== id);
    console.log('=======> ', newData);

    const newObject = JSON.stringify(newData, null, 2);
    fs.writeFile('./db/db.json', newObject, (err, data) => {
      if (err) throw err;
      res.json(data);
    });
  });
});

// SERVER
const PORT = 3000;
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});

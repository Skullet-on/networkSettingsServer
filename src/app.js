const express = require('express');
const app = express();
const port = 8000;

const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/";

const fs = require('fs');
let db;

let data = fs.readFileSync('./src/resources/mock.json');  
let wifi = JSON.parse(data);

MongoClient.connect(url, function(err, database) {
    if (err) throw err;
    db = database.db("wifisdb");
    db.collection("wifis").find({}).toArray(function(err, result) {
        if (err) throw err;
        if (!result.length) {
            db.collection("wifis").insertMany(wifi, function(err, result){ 
                if(err){ 
                    return console.log(err);
                }
             });
        }
    });
});

app.get('/wifis', (req, res) => {
    db.collection("wifis").find({}).toArray(function(err, result) {
        if (err) throw err;
        res.send(result);
      });
});

app.get('/', (req, res) => {
    res.send('Hello World!');
    console.log(data);
});

app.listen(port, () => {
    console.log('Example app listening on port ' + port);
});

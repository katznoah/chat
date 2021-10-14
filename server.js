import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDhjTPE6a4lg8sOvHVMEDGeznnRGrV1MSQ",
  authDomain: "cisc-chat-app.firebaseapp.com",
  databaseURL: "https://cisc-chat-app-default-rtdb.firebaseio.com",
  projectId: "cisc-chat-app",
  storageBucket: "cisc-chat-app.appspot.com",
  messagingSenderId: "482169031704",
  appId: "1:482169031704:web:8d3a1eaad933341406c76d",
  measurementId: "G-EQ825BF9Q6"
};

const fbapp = initializeApp(firebaseConfig);
const auth = getAuth(fbapp);
const rtdb = getDatabase(fbapp);

import express from 'express';
import path from 'path';
import sqlite3 from 'sqlite3';

const app = express();
const port = 3000;

const db = new sqlite3.Database('app.db');

app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(path.join(path.resolve(path.dirname('')), 'public/index.html'));
});

app.listen(port, () => {console.log(`listening at http://localhost:${port}`);});

//db.run(`insert into "users" values("1", "noahkatz", "pass1")`);
//db.run(`insert into "servers" values("1", "hello world server!")`);
//db.run(`insert into "servers" values("2", "hello world server part 2!")`);
//db.run(`insert into "enrollments" values("1","1")`);
//db.run(`insert into "enrollments" values("2","1")`);

// db.run(`delete from "enrollments" where server_id != "0"`);
// db.run('delete from "servers" where server_id != "0"');

app.post("/servers/*", (req, res) => {
    const uid = req.url.split('/')[2];
    let response = {};
    db.all(`select server_name, servers.server_id from servers left join enrollments on servers.server_id = enrollments.server_id where uid = "${uid}"`, (err, data) => {
        if(err) {
            console.log('query error');
            res.send(response);
            return;
        }
        for(let datum in data) {
            response[datum] = data[datum];
        };
        res.send(response);
    });
});
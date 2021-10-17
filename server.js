import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, signOut, confirmPasswordReset, sendPasswordResetEmail, signInWithEmailAndPassword} from "firebase/auth";

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
const port = process.env.PORT || 3000;

const db = new sqlite3.Database('app.db');
let modified = false;
let lock = false;

app.use(express.static('public'));

app.get('/*', function(req, res) {
    res.sendFile(path.join(path.resolve(path.dirname('')), 'public/index.html'));
});

app.listen(port, () => {console.log(`listening at http://localhost:${port}`);});

app.post("/servers/*", (req, res) => {
    const uid = req.url.split('/')[2];
    let response = {};
    db.all(`select server_name, servers.server_id from servers left join enrollments on servers.server_id = enrollments.server_id where uid = "${uid}"`, (err, data) => {
        if(err) {
            console.log('query error: error getting servers');
            res.send('err');
            return;
        }
        for(let datum in data) {
            response[datum] = data[datum];
        }
        res.send(response);
    });
});

app.post("/login/*", (req, res) => {
    const url = req.url.split('/');
    const email = url[2];
    const pass = url[3];
    try {
        signInWithEmailAndPassword(auth, email, pass).then((creds)=>{
            const uid = (creds['_tokenResponse']['localId']);
            res.end(uid);
        }).catch(err => {res.end('');});
    } catch(err) {res.end('');}
});

app.post("/repeat/*", (req, res) =>{
    res.send('aaa');
});

app.post('/reset/*', (req, res) => {
    const email = req.url.split('/')[2];
    sendPasswordResetEmail(auth, email);
    res.end(`${email} password resetting"`);
});

app.post('/enterReset/*', (req, res) => {
    const url = req.url.split('/');
    const pass = url[2];
    const code = url[3];
    confirmPasswordReset(auth, code, pass);
    res.end("password reset");
});

app.post('/getMessages/:uid/:server_id', (req, res) => {
    if(!modified) {
        res.send('nm');
        return;
    }
    const server_id = req.params.server_id;
    const uid = req.params.uid;
    let role = '';
    let server_name = '';
    db.get(`select role, server_name from enrollments left join servers on servers.server_id = enrollments.server_id where uid = "${uid}" and enrollments.server_id = "${server_id}"`, (err, data) => {
        if(err || !data) {
            console.log(err);
            return;
        };
        server_name = data['server_name'];
        role = data['role'];
        db.all(`select messages.message, messages.message_date, users.username, messages.edited from messages left join users on messages.uid = users.uid where server_id = "${server_id}"`, (err, msg_data) => {
            if(err) {
                console.log(err);
                return;
            }
            res.json({'server_name': server_name, 'role': role, 'data': msg_data});
        });
    });
});

app.post('/initGetMessages/:uid/:server_id', (req, res) => {
    const server_id = req.params.server_id;
    const uid = req.params.uid;
    let role = '';
    let server_name = '';
    db.get(`select role, server_name from enrollments left join servers on servers.server_id = enrollments.server_id where uid = "${uid}" and enrollments.server_id = "${server_id}"`, (err, data) => {
        if(err || !data) {
            console.log(err);
            return;
        };
        server_name = data['server_name'];
        role = data['role'];
        db.all(`select messages.message, messages.message_date, users.username, messages.edited from messages left join users on messages.uid = users.uid where server_id = "${server_id}"`, (err, msg_data) => {
            if(err) {
                console.log(err);
                return;
            }
            res.json({'server_name': server_name, 'role': role, 'data': msg_data});
        });
    });
});

app.post('/logout/:uid', (req, res) => {
    signOut(auth);
    res.send('logout successful');
});

app.post('/updateMsg/:msg/:timestamp', (req, res) => {
    db.run(`update "messages" set message = "${req.params.msg}", edited = "edited" where message_date = '${req.params.timestamp}'`, () => {
        modified = true;
        res.send('updated');
        setTimeout(() => {modified = false;}, 3000);
    });
});

app.post('/newMsg/:msg/:server_id/:uid', (req, res) => {
    if(lock) {
        res.send('locked');
        return;
    }
    lock = true;
    modified = true;
    try {
        db.run(`insert into "messages" values("${new Date()}", "${req.params.uid}", "${req.params.msg}", "${req.params.server_id}", "")`);
    } catch(err) {}
    setTimeout(() => {modified = false;}, 3000);
    setTimeout(() => {lock = false;}, 1001);
    res.send('msg sent');
});
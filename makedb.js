import sqlite3 from 'sqlite3';
let db = new sqlite3.Database("app.db");

// The following is how I created my sqlite database:
const createDB = () => {
    db.run(`create table users (uid text primary key, username text)`);
    db.run(`create table servers (server_id text primary key, server_name text);`);
    db.run(`create table messages (message_date text primary key, uid text, message text, server_id text, edited text, foreign key(uid) references users(uid), foreign key(server_id) references servers(server_id))`);
    db.run(`create table enrollments (server_id text, uid text, role text, primary key(server_id, uid), foreign key(server_id) references servers(server_id), foreign key(uid) references users(uid))`);
    db.run('insert into "servers" values("1337", "General Chat")');
};

// I use the following to clear my database (except for the general chat server) when I redeploy:
const redeploy = () => {
    db.run('delete from "enrollments" where server_id != "-1"');
    db.run('delete from "messages" where server_id != "-1"');
    db.run('delete from "users" where uid != "-1"');
    db.run('delete from "servers" where server_id != "1337"');
    db.all('select * from servers', (err, data) => {console.log(data)});
};

redeploy();
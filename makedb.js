const sqlite3 = require('sqlite3');
let db = new sqlite3.Database("app.db");

//db.run(`create table users (uid text primary key, username text, password text)`);
//db.run(`create table servers (server_id text primary key, server_name text);`);
//db.run(`create table messages (message_date text primary key, uid text, message text, server_id text, edited text, foreign key(uid) references users(uid), foreign key(server_id) references servers(server_id))`);
//db.run(`create table enrollments (server_id text, uid text, primary key(server_id, uid), foreign key(server_id) references servers(server_id), foreign key(uid) references users(uid))`);

db.all(`select name, sql from sqlite_master where name not like "%auto%"`, (err, data) => {
    if(err) throw new Error();
    for(datum in data) {
        console.log(`${data[datum]['name']}: ${data[datum]['sql']}`);
    }
});

import sqlite3 from 'sqlite3';
let db = new sqlite3.Database("app.db");

db.run(`drop table enrollments; drop table messages; drop table users; create table users (uid text primary key, username text)`);
//db.run(`drop table servers; create table servers (server_id text primary key, server_name text);`);
//db.run(`create table messages (message_date text primary key, uid text, message text, server_id text, edited text, foreign key(uid) references users(uid), foreign key(server_id) references servers(server_id))`);
db.run(`create table enrollments (server_id text, uid text, role text, primary key(server_id, uid), foreign key(server_id) references servers(server_id), foreign key(uid) references users(uid))`);

//db.run(`insert into "users" values("1", "noahkatz", "pass1")`);
//db.run(`insert into "servers" values("1", "hello world server!")`);
//db.run(`insert into "servers" values("2", "hello world server part 2!")`);
//db.run(`insert into "enrollments" values("1","1","admin")`);
//db.run(`insert into "enrollments" values("2","1","user")`);

db.all(`select name, sql from sqlite_master where name not like "%auto%"`, (err, data) => {
    if(err) throw new Error();
    for(let datum in data) {
        console.log(`${data[datum]['name']}: ${data[datum]['sql']}`);
    }
});

import sqlite3 from 'sqlite3';
let db = new sqlite3.Database("app.db");

//db.run(`drop table enrollments`);
//db.run('drop table messages');
//db.run('drop table users');
//db.run(`create table users (uid text primary key, username text)`);
//db.run(`create table servers (server_id text primary key, server_name text);`);
//db.run(`create table messages (message_date text primary key, uid text, message text, server_id text, edited text, foreign key(uid) references users(uid), foreign key(server_id) references servers(server_id))`);
//db.run(`create table enrollments (server_id text, uid text, role text, primary key(server_id, uid), foreign key(server_id) references servers(server_id), foreign key(uid) references users(uid))`);

//db.run(`insert into "users" values("0JpHLS5cbPM3PZbyj9mr6mFc20t2", "noahkatz@gmail.com")`);
//db.run(`insert into "servers" values("1", "hello world server!")`);
//db.run(`insert into "servers" values("2", "hello world server part 2!")`);
//db.run(`insert into "enrollments" values("1","0JpHLS5cbPM3PZbyj9mr6mFc20t2","admin")`);
//db.run(`insert into "enrollments" values("2","0JpHLS5cbPM3PZbyj9mr6mFc20t2","user")`);

db.all(`select name, sql from sqlite_master where name not like "%auto%"`, (err, data) => {
    if(err) throw new Error();
    for(let datum in data) {
        console.log(`${data[datum]['name']}: ${data[datum]['sql']}`);
    }
});

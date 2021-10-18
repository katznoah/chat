//import sqlite3 from 'sqlite3';
//let db = new sqlite3.Database("app.db");

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
//db.run(`delete from enrollments where server_id != "1"`);
//db.run(`insert into "messages" values("${new Date()}","0JpHLS5cbPM3PZbyj9mr6mFc20t2", "hello this is my message", "1","")`);
//db.run('insert into "servers" values("1337", "General Chat")');
//db.run('insert into "enrollments" values("1337", "0JpHLS5cbPM3PZbyj9mr6mFc20t2", "user")');
/*db.all(`select name, sql from sqlite_master where name not like "%auto%"`, (err, data) => {
    if(err) throw new Error();
    for(let datum in data) {
        console.log(`${data[datum]['name']}: ${data[datum]['sql']}`);
    }
});*/

//db.run(`update "enrollments" set role = "admin" where uid = "0JpHLS5cbPM3PZbyj9mr6mFc20t2" and server_id = "1"`);
/*
db.all('select server_id from servers', (err, data) => {
    let nums = [];
    for(let item in data) {
        nums.push(+(data[item]['server_id']));
    }
    const max = (nums.sort((a,b) => a - b)[nums.length-1]);
    console.log(max);
});*/

//db.run('delete from "servers" where server_id != "1337"');
//db.all('select * from servers', (err, data) => {console.log(data)});

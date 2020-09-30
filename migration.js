const e = require('express');
const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('./database.sqlite');


db.run(`CREATE TABLE IF NOT EXISTS Artist (id INTEGER NOT NULL, name TEXT NOT NULL, date_of_birth TEXT NOT NULL,
    biography TEXT NOT NULL, is_currently_employed INTEGER DEFAULT 1, PRIMARY KEY(id))`);

db.run(`CREATE TABLE IF NOT EXISTS Series (id INTEGER NOT NULL, name TEXT NOT NULL, description TEXT NOT NULL, PRIMARY KEY(id))`);
    
// db.run('INSERT INTO Series (name, description) VALUES ("me", "ha")', (err) => {
//     db.all('SELECT * FROM Series', (err, series) => {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log(series);
//         }
//     })
// });








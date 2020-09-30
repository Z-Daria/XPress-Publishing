const express = require('express');
const artistRouter = express.Router();
const sqlite3 = require('sqlite3');

const db = new sqlite3.Database(process.env.TEST_DATABASE || '../database.sqlite');



artistRouter.get('/', (req, res, next) => {
    db.all('SELECT * FROM Artist WHERE is_currently_employed = 1', (error, rows) => {
        if (error) {
            next(error);
        } else {
            res.status(200).json({artists: rows});
        }
    })
});

artistRouter.param('artistId', (req, res, next, id) => {
    db.get('SELECT * FROM Artist WHERE id = $id', {
        $id: id
    }, (err, artist) => {
        if (err) {
            next(err);
        } else if (artist) {
            req.artist = artist;
            next();
        } else {
            res.status(404).send();
        }
    })
});

artistRouter.get('/:artistId', (req, res, next) => {
    res.status(200).json({artist: req.artist});
});

artistRouter.post('/', (req, res, next) => {
    const name = req.body.artist.name;
    const dateOfBirth = req.body.artist.dateOfBirth;
    const biography = req.body.artist.biography;
    if (!name || !dateOfBirth || !biography) {
        res.status(400).send();
    } else {
        const isCurrentlyEmployed = req.body.artist.isCurrentlyEmployed === 0 ? 0 : 1;
        const sql = 'INSERT INTO Artist (name, date_of_birth, biography, is_currently_employed) VALUES ($name, $dateOfBirth, $biography, $isCurrentlyEmployed)';
        const values = {
            $name: name,
            $dateOfBirth: dateOfBirth,
            $biography: biography,
            $isCurrentlyEmployed: isCurrentlyEmployed
        };
        db.run(sql, values, function(err) {
                db.get(`SELECT * FROM Artist WHERE id = ${this.lastID}`, 
                (err, artist) => {
                    if (err) {
                        next(err);
                    } else {
                        res.status(201).json({artist: artist});
                    }
                })
            })
    }
});

artistRouter.put('/:artistId', (req, res, next) => {
    const id = req.artist.id;
    const name = req.body.artist.name;
    const dateOfBirth = req.body.artist.dateOfBirth;
    const biography = req.body.artist.biography;
    if (!name || !dateOfBirth || !biography) {
        res.status(400).send();
    } else {
        const isCurrentlyEmployed = req.body.artist.isCurrentlyEmployed === 0 ? 0 : 1;
        const sql = 'UPDATE Artist SET name = $name, date_of_birth = $dateOfBirth, biography = $biography, is_currently_employed = $isCurrentlyEmployed WHERE id = $id';
        const values = {
            $id: id,
            $name: name,
            $dateOfBirth: dateOfBirth,
            $biography: biography,
            $isCurrentlyEmployed: isCurrentlyEmployed
        };
        db.run(sql, values, (err) => {
            if (err) {
                next(err);
            } else {
                db.get(`SELECT * FROM Artist WHERE id = ${id}`, (err, artist) => {
                    if (err) {
                        next(err);
                    } else {
                        res.status(200).json({artist: artist});
                    }
                })
            }
        })
    }
});

artistRouter.delete('/:artistId', (req, res, next) => {
    const id = req.artist.id;
    db.run(`UPDATE Artist SET is_currently_employed = 0 WHERE id = ${id}`, (err) => {
        if (err) {
            next(err);
        } else {
            db.get(`SELECT * FROM Artist WHERE id = ${id}`, (err, artist) => {
                if (err) {
                    next(err);
                } else {
                    res.status(200).json({artist: artist});
                }
            })
        }
    })
});

module.exports = artistRouter;
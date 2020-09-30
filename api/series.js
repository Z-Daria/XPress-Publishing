const { json } = require('body-parser');
const express = require('express');
const seriesRouter = express.Router();
const sqlite3 = require('sqlite3');
const issuesRouter = require('./issues.js');
seriesRouter.use('/:seriesId/issues', issuesRouter);

const db = new sqlite3.Database(process.env.TEST_DATABASE || '../database.sqlite');

seriesRouter.get('/', (req, res, next) => {
    db.all('SELECT * FROM Series', (err, series) => {
        if (err) {
            next(err);
        } else {
            res.status(200).json({series: series});
        }
    })
});

seriesRouter.param('seriesId', (req, res, next, id) => {
    db.get(`SELECT * FROM Series WHERE id = ${id}`, (err, series) => {
        if (err) {
            next(err);
        } else if (series) {
            req.series = series;
            next();
        } else {
            res.status(404).send();
        }
    })
});

seriesRouter.get('/:seriesId', (req, res, next) => {
    res.status(200).json({series: req.series});
});

seriesRouter.post('/', (req, res, next) => {
    const name = req.body.series.name;
    const description = req.body.series.description;
    if (!name || !description) {
        res.status(400).send();
    } else {
        const sql = 'INSERT INTO Series (name, description) VALUES ($name, $description)';
        const values = { $name: name, $description: description};
        db.run(sql, values, function(err) {
            if (err) {
                next(err);
            } else {
                db.get(`SELECT * FROM Series WHERE id =${this.lastID}`, (err, series) => {
                    if (err) {
                        next(err);
                    } else {
                        res.status(201).json({series: series});
                    }
                })
            }
        })
    }
});

seriesRouter.put('/:seriesId', (req, res, next) => {
    const id = req.series.id;
    const name = req.body.series.name;
    const description = req.body.series.description;
    if (!name || !description) {
        res.status(400).send();
    } else {
        db.run(`UPDATE Series SET name = "${name}", description = "${description}" WHERE id = ${id}`, (err) => {
            if (err) {
                next(err);
            } else {
                db.get(`SELECT * FROM Series WHERE id = ${id}`, (err, series) => {
                    if (err) {
                        next(err); 
                    } else {
                        res.status(200).json({series: series});
                    }
                })
            }
        })
    }
});

seriesRouter.delete('/:seriesId', (req, res, next) => {
    const id = req.series.id;
    db.get(`SELECT * FROM Issue WHERE series_id = ${id}`, (err, issue) => {
        if (err) {
            next(err);
        } else if(issue) {
            res.status(400).send();
        } else {
            db.run(`DELETE FROM Series WHERE id = ${id}`, (err) => {
                if (err) {
                    next(err);
                } else {
                    res.status(204).send();
                }
            })
        }
    })
});

module.exports = seriesRouter;
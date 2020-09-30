const express = require('express');
const issuesRouter = express.Router({mergeParams: true});
const sqlite3 = require('sqlite3');

const db = new sqlite3.Database(process.env.TEST_DATABASE || '../database.sqlite');

issuesRouter.get('/', (req, res, next) => {
    const id = req.series.id;
    db.all(`SELECT * FROM Issue WHERE series_id = ${id}`, (err, issues) => {
        if (err) {
            next(err);
        } else {
            res.status(200).json({issues: issues});
        }
    })
});

issuesRouter.post('/', (req, res, next) => {
    const seriesId = req.series.id;
    const name = req.body.issue.name;
    const issueNumber = req.body.issue.issueNumber;
    const publicationDate = req.body.issue.publicationDate;
    const artistId = req.body.issue.artistId;
    const sql = 'INSERT INTO Issue (name, issue_number, publication_date, artist_id, series_id) VALUES ($name, $issueNumber, $publicationDate, $artistId, $seriesId)';
    const values = {
        $name: name,
        $issueNumber: issueNumber,
        $publicationDate: publicationDate,
        $artistId: artistId,
        $seriesId: seriesId
    };
    if (!name || !issueNumber || !publicationDate || !artistId) {
        res.status(400).send();
    } else {
        db.get(`SELECT * FROM Artist WHERE id = ${artistId}`, (err, artist) => {
            if (err) {
                next(err);
            } else if (artist) {
                res.status(400).send();
            } else {
                db.run(sql, values, function(err) {
                    if (err) {
                        next(err);
                    } else {
                        db.get(`SELECT * FROM Issue WHERE id = ${this.lastID}`, (err, issue) => {
                            if (err) {
                                next(err);
                            } else {
                                res.status(201).json({issue: issue});
                            }
                        })
                    }
                })
            }
        })
    }
});

issuesRouter.param('issueId', (req, res, next, id) => {
    db.get(`SELECT * FROM Issue WHERE id = ${id}`, (err, issue) => {
        if (err) {
            next(err);
        } else if (issue) {
            req.issue = issue;
            next();
        } else {
            res.status(404).send();
        }
    })
});

issuesRouter.put('/:issueId', (req, res, next) => {
    const seriesId = req.series.id;
    const issueId = req.issue.id;
    const name = req.body.issue.name;
    const issueNumber = req.body.issue.issueNumber;
    const publicationDate = req.body.issue.publicationDate;
    const artistId = req.body.issue.artistId;
    const sql = 'UPDATE Issue SET name = $name, issue_number = $issueNumber, publication_date = $publicationDate, artist_id = $artistId, series_id = $seriesId WHERE id = $issueId';
    const values = {
        $name: name,
        $issueNumber: issueNumber,
        $publicationDate: publicationDate,
        $artistId: artistId,
        $seriesId: seriesId,
        $issueId: issueId
    };
    if (!name || !issueNumber || !publicationDate || !artistId) {
        res.status(400).send();
    } else {
        db.get(`SELECT * FROM Artist WHERE id = ${artistId}`, (err, artist) => {
            if (err) {
                next(err);
            } else if (artist) {
                res.status(400).send();
            } else {
                db.run(sql, values, function(err) {
                    if (err) {
                        next(err);
                    } else {
                        db.get(`SELECT * FROM Issue WHERE id = ${issueId}`, (err, issue) => {
                            if (err) {
                                next(err);
                            } else {
                                res.status(200).send();
                            }
                        })
                    }
                })
            }
        })
    }
});

issuesRouter.delete('/:issueId', (req, res, next) => {
    const id = req.issue.id;
    db.run(`DELETE FROM Issue WHERE id = ${id}`, (err) => {
        if (err) {
            next(err);
        } else {
            res.status(204).send();
        }
    })
});

module.exports = issuesRouter;
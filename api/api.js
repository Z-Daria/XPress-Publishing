const express = require('express');
const app = express();
const artistRouter = require('./artist.js');

const apiRouter = express.Router();

app.use('/artist', artistRouter);



module.exports = apiRouter;
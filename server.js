const bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require('errorhandler');
const express = require('express');
const morgan = require('morgan');
const apiRouter = require('./api/api.js');
const artistRouter = require('./api/artist.js');
const seriesRouter = require('./api/series.js');

const PORT = process.env.PORT || 4001;

const app = express();
  
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(errorHandler());
app.use(cors());

app.use('/api', apiRouter);
app.use('/api/artists', artistRouter);
app.use('/api/series', seriesRouter);

app.listen(PORT, () => {
    console.log('Listening...');
});

module.exports = app;

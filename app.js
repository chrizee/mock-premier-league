const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const teamsRoute = require('./src/v1/routes/team.route');
const authRoute = require('./src/v1/routes/auth.route');
const fixtureRoute = require('./src/v1/routes/fixtures.route');
const SearchRoute = require('./src/v1/routes/search.route');

const app = express();
//using in-built express body-parser
app.use(express.json());

//db config
const db = process.env.NODE_ENV === 'test' ? process.env.DATABASE_URI_TEST  : process.env.DATABASE_URI;
//connect to mongo
mongoose.connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true
})
.then(() => {})
.catch(err => {})

app.use('/api/v1/search', SearchRoute);
app.use('/api/v1/teams', teamsRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/fixtures', fixtureRoute);

module.exports = app;
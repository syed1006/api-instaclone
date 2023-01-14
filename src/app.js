const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const upload = require('./middleware/handleImages')

app.use(express.urlencoded({ extended: false }));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Import routes
const postRoute = require('./routes/post');
const userRoute = require('./routes/user');


//Router MIddlewares
const fetchUser = require('./middleware/fetchUser');
app.use('/', fetchUser, postRoute);
app.use('/', userRoute);

module.exports = app;

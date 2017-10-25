const https = require('https');
const fs = require('fs');
const express = require('express');
const app = express();

const privateKey = fs.readFileSync('./key/key.pem');
const certificate = fs.readFileSync('./key/key-cert.pem');
const credential = {
    key: privateKey,
    cert: certificate
}

const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use('/assets', express.static(__dirname + '/public'));
app.use('/practice', express.static('C:/Users/d001105/repos/Gmail-client'));

const setupController = require('./controllers/setupController');
const todoRestController = require('./controllers/todoRestController');
const todoController = require('./controllers/todoController');

setupController(app);
todoRestController(app);
todoController(app);

https.createServer(credential, app).listen(port);
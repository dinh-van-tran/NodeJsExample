const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use('/assets', express.static(__dirname + '/public'));

const setupController = require('./controllers/setupController');
const todoRestController = require('./controllers/todoRestController');
const todoController = require('./controllers/todoController');

setupController(app);
todoRestController(app);
todoController(app);

app.listen(port);
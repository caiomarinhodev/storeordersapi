const express = require('express');
const clientRoute = express.Router();

clientRoute.use('/site', express.static('public'));

clientRoute.get('/', function (req, res) {
    res.send('Hello World - This is an API for the Order list - built with Node.js and Express.js - by Caio Marinho');
})

module.exports = clientRoute;
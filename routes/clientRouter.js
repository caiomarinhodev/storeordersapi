const express = require('express');
const clientRoute = express.Router();

clientRoute.use('/', express.static('public'));


module.exports = clientRoute;
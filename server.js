require('dotenv').config()
const express = require('express');

const app = express();
const cors = require('cors');
const bcrypt = require('bcryptjs');

const clientRoute = require('./routes/clientRouter');
const apiRoute = require('./routes/apiRouter');
const secRouter = require('./routes/secRouter');

const jwt = require('jsonwebtoken');

const PORT = process.env.PORT || 3000

// Cria um manipulador da rota padrão


app.use(function (req, res, next) {
    console.log(new Date().toLocaleString(), req.method, req.url, req.query);
    next();
});

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));


app.use('', clientRoute);

app.use('/api', apiRoute);

app.use('/sec', secRouter);


app.listen(PORT, () => console.log(`Listening on ${PORT}`))
const express = require('express');
const secRouter = express.Router();

const database_url = process.env.DATABASE_URL || 'postgres://gnzwjwfncbbsxf:5903dca2b9431042890c8eca52e4cb1a381b786c0547abde3c29a76628a301d9@ec2-54-87-179-4.compute-1.amazonaws.com:5432/d1dfvrlrfuumgt';

const knex = require('knex')({
    client: 'pg',
    connection: {
        connectionString: database_url,
        ssl: { rejectUnauthorized: false }, // SSL is not required
    }
});
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

secRouter.post('/login', express.json(), (req, res) => {
    const { login, password } = req.body;
    knex.select('*').from('usuario').where('login', login).then(function (result) {
        if (result.length > 0) {
            let usuario = result[0];
            let checkSenha = bcrypt.compareSync(req.body.senha, usuario.senha)
            console.log(checkSenha, usuario.senha, req.body.senha);
            if (checkSenha) {
                let token = jwt.sign({ id: result[0].id }, process.env.SECRET_KEY, { expiresIn: 3600 });
                res.status(200).json({
                    message: 'Login realizado com sucesso',
                    token: token,
                    login: usuario.login,
                    id: usuario.id,
                    nome: usuario.nome,
                    roles: usuario.roles
                });
            } else {
                res.status(401).json({
                    message: 'Senha incorreta'
                });
            }
        } else {
            res.status(401).json({
                message: 'Usuário não encontrado'
            });
        }
    });
});

secRouter.post('/register', express.json(), (req, res) => {
    const { nome, login, email, senha } = req.body;
    console.log(req.body);
    knex.select('*').from('usuario').where('email', email).then(function (result) {
        if (result.length > 0) {
            res.status(400).json({
                message: 'Usuário já cadastrado'
            });
        } else {
            bcrypt.hash(senha, 8, function (err, hash) {
                knex('usuario').insert({
                    nome: nome,
                    email: email,
                    senha: hash,
                    login: login
                }, ['id']).then(function (result) {
                    console.log(result);
                    res.status(201).json({
                        'message': 'Usuário cadastrado com sucesso',
                        'id': result[0].id
                    });
                }).catch(function (err) {
                    console.log(err);
                    res.status(500).json({
                        message: 'Erro ao cadastrar usuário'
                    });
                });
            });
        }
    }).catch(function (err) {
        res.status(500).json({
            message: 'Erro ao cadastrar usuário'
        });
    });
});



module.exports = secRouter;
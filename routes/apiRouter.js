const express = require('express');
const apiRouter = express.Router();

const database_url = process.env.DATABASE_URL || 'postgres://gnzwjwfncbbsxf:5903dca2b9431042890c8eca52e4cb1a381b786c0547abde3c29a76628a301d9@ec2-54-87-179-4.compute-1.amazonaws.com:5432/d1dfvrlrfuumgt';

const knex = require('knex')({
    client: 'pg',
    connection: {
        connectionString: database_url,
        ssl: { rejectUnauthorized: false }, // SSL is not required
    }
});

const jwt = require('jsonwebtoken');


const checkToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log(req.headers);
    if (!authHeader) {
        return res.status(401).send({ auth: false, message: 'No token provided.' });
    } else {
        let token = authHeader.split(' ')[1];
        req.token = token;
    }
    jwt.verify(req.token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).send({ auth: false, message: 'Acesso Negado' });
        }
        req.usuarioId = decoded.id;
        next();
    });
}

const isAdmin = (req, res, next) => {
    knex.select('*').from('usuario').where('id', req.usuarioId).then(function (result) {
        if (result.length > 0) {
            let roles = usuario.roles.split(';')
            let adminRole = roles.find(i => i === 'ADMIN')
            if (adminRole === 'ADMIN') {
                next();
            } else {
                return res.status(401).json({ auth: false, message: 'Acesso Negado' });
            }
        } else {
            return res.status(403).json({ auth: false, message: 'Role de ADMIN requerida' });
        }
    }).catch(function (err) {
        console.log(err);
        res.status(500).json({
            message: 'Erro ao buscar usuário'
        });
    });
}

apiRouter.get('/pedidos', checkToken, (req, res) => {
    knex.select('*').from('pedido')
        .then(pedidos => res.status(200).json(pedidos))
        .catch(err => {
            res.status(500).json({
                message: 'Erro ao recuperar pedidos - ' + err.message
            })
        })
});

apiRouter.post('/pedidos', checkToken, function (req, res) {
    const pedido = req.body;
    knex('pedido').insert(pedido, ['id', 'nome_cliente', 'id_status', 'valor_total', 'observacao']).then(function (result) {
        res.status(201).send(result[0]);
    });
});

apiRouter.get('/pedidos/:id', checkToken, function (req, res) {
    let id = req.params.id;
    knex.select('*').from('pedido').where('id', id).then(function (result) {
        if (result.length > 0) {
            console.log(result);
            res.status(200).send(result[0]);
        } else {
            res.status(404).send("Pedido não encontrado");
        }
    }).catch(err => {
        res.status(500).json({
            message: 'Erro ao recuperar pedido - ' + err.message
        })
    });
});


apiRouter.put('/pedidos/:id', checkToken, (req, res) => {
    const { id } = req.params;
    const { nome_cliente, id_status, valor_total, observacao } = req.body;
    knex.select('*').from('pedido').where('id', id).then(function (result) {
        if (result.length > 0) {
            knex('pedido').where('id', id).update({ nome_cliente, id_status, valor_total, observacao }, ['id', 'nome_cliente',
                'id_status', 'valor_total', 'observacao']).then(function (result) {
                    res.status(200).json(result[0]);
                }).catch(err => {
                    res.status(500).json({
                        message: 'Erro ao atualizar pedido - ' + err.message
                    })
                });
        } else {
            res.status(404).send("pedido não encontrado");
        }
    }).catch(err => {
        res.status(500).json({
            message: 'Erro ao recuperar pedido - ' + err.message
        })
    });
});

apiRouter.delete('/pedidos/:id', checkToken, function (req, res) {
    let id = req.params.id;
    knex.select('*').from('pedido').where('id', id).then(function (result) {
        if (result.length > 0) {
            knex('pedido').where('id', id).del().then(function (result) {
                res.status(200).json({ 'status': 'ok' });
            }).catch(err => {
                res.status(500).json({
                    message: 'Erro ao deletar pedido - ' + err.message
                })
            });
        } else {
            res.status(404).send("pedido não encontrado");
        }
    }).catch(err => {
        res.status(500).json({
            message: 'Erro ao recuperar pedido - ' + err.message
        })
    });
});

module.exports = apiRouter;
const { knex } = require('../conexao');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const verificaLogin = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json('Não autorizado');
    }

    try {
        const token = authorization.replace('Bearer ', '').trim();
        const { id } = jwt.verify(token, process.env.SENHA_HASH);
        const perfil = await knex('usuarios').where({id});

        if (perfil.length === 0) {
            return res.status(404).json('Usuario não encontrado');
        }

        const { senha, ...usuario } = perfil;

        req.usuario = usuario[0];

        next();
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = verificaLogin
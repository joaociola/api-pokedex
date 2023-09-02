const {knex} = require('../conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const login = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(404).json('É obrigatório email e senha');
    }

    try {
        const perfilUsuario = await knex('usuarios').where({email}).first()

        if (perfilUsuario.length === 0) {
            return res.status(400).json("O usuario não foi encontrado");
        }

        const senhaCorreta = await bcrypt.compare(senha, perfilUsuario.senha);

        if (!senhaCorreta) {
            return res.status(400).json("Email e senha não confere");
        }

        const token = jwt.sign({ id: perfilUsuario.id }, process.env.SENHA_HASH, { expiresIn: '8h' });

        const { senha: _, ...dadosUsuario } = perfilUsuario;

        return res.status(200).json({
            usuario: dadosUsuario,
            token
        });

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    login
}
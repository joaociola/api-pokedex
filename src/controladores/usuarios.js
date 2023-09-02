const { knex } = require('../conexao');
const bcrypt = require('bcrypt');

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha, nome_loja } = req.body;

    if (!nome) {
        return res.status(404).json("O campo nome é obrigatório");
    }

    if (!email) {
        return res.status(404).json("O campo email é obrigatório");
    }

    if (!senha) {
        return res.status(404).json("O campo senha é obrigatório");
    }

    if (!nome_loja) {
        return res.status(404).json("O campo nome_loja é obrigatório");
    }

    try {
        const selectUsuarios = await knex('usuarios').where({ email })


        if (selectUsuarios.length == 1) {
            return res.status(400).json("O email já existe");
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const cadastrarUsuario = await knex('usuarios').insert({ 
            nome,
            email,
            senha: senhaCriptografada,
            nome_loja
        })

        if (cadastrarUsuario.rowCount === 0) {
            return res.status(400).json("O usuário não foi cadastrado.");
        }

        return res.status(200).json("O usuario foi cadastrado com sucesso!");
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

const obterPerfil = async (req, res) => {
    const {senha: _, ...perfil} = req.usuario
    return res.status(200).json(perfil);
}

const atualizarPerfil = async (req, res) => {
    const { nome, email, senha, nome_loja } = req.body;
    const { id } = req.usuario;

    if (!nome && !email && !senha && !nome_loja) {
        return res.status(404).json('É obrigatório informar ao menos um campo para atualização');
    }

    try {
        const body = {};
        const params = [];

        if (nome) {
            body.nome = nome;
            params.push(nome);
        }
        if(email){
            if (email !== req.usuario.email) {           
                const validarEmail = await knex('usuarios').where({email}).select('email')
                if (validarEmail.length > 0) {
                    return res.status(400).json("O email já existe");
                }
                body.email = email;
                params.push(email);
            }
        }

        if (senha) {
            body.senha = await bcrypt.hash(senha, 10);
            params.push(body.senha);
        }

        if (nome_loja) {
            body.nome_loja = nome_loja
            params.push(nome_loja);
        }
  
        const usuarioAtualizado = await knex('usuarios').where({id}).update(body)    

        if (usuarioAtualizado.length === 0) {
            return res.status(400).json("O usuario não foi atualizado");
        }

        return res.status(200).json('Usuario foi atualizado com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    cadastrarUsuario,
    obterPerfil,
    atualizarPerfil
}
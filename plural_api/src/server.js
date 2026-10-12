// Frameworks
const express = require('express');
const app = express()
const bcrypt = require('bcrypt');
const { Pool } = require("pg");
const jwt = require("jsonwebtoken");
require('dotenv').config();

app.use(express.json())

const pool = new Pool({

    host: "localhost",
    port: 5432,
    database: "plural_db",
    user: "dev",
    password: "aluno"

})

const PORT = process.env.PORT;

app.listen(PORT, () => {

    console.log(`===============================================`);
    console.log(`=== SERVIDOR ATIVO - http://localhost:3000/ ===`);
    console.log(`===============================================`);

})

// BOAS VINDAS

app.get('/', (req,res) => {

    res.json({

        mensagem: "Bem vindo ao sistema de Colegio Plural"

    })

})

// USUARIO

app.post('/cadastro', async (req, res) => {

    const { nome, senha } = req.body;

    const hash = await bcrypt.hash(senha, 10);

    const resultado = await pool.query(
        `
        INSERT INTO usuario (nome, senha)
        VALUES
        ($1, $2)
        RETURNING *
        `,
        [nome, hash]
    )

    res.json(resultado.rows[0]);

})

app.post('/login', async (req, res) => {

    const { nome, senha } = req.body;

    const resultado = await pool.query(
        `
        SELECT * FROM usuario WHERE nome = $1
        `,
        [nome]
    )

    if (resultado.rows.length === 0){

        res.status(401).json({
            mensagem:"ERRO :: Usuario ou Senha INCORRETOS"
        })

    }

    const user = resultado.rows[0];

    const confirmar_senha = await bcrypt.compare(
        senha, user.senha
    )

    if (!confirmar_senha){

        res.status(401).json({
            mensagem:"ERRO :: Usuario ou Senha INCORRETOS"
        })

    }

    const token = jwt.sign(
        {
            id: user.id,
            nome: user.nome
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h'}
    )

    res.status(200).json({

        mensagem:"SUCESSO :: Login efetuado!!!",
        token: token

    })

})

// RESPONSAVEL

app.get('/responsavel', async (req, res) => {

    const resultado = await pool.query(
        `
            SELECT * FROM responsavel
        `)

    res.json(resultado.rows)

})

app.get('/responsavel/:busca', async (req, res) => {

    const { busca } = req.params

    const resultado = await pool.query(
        `
            SELECT * FROM responsavel
            WHERE nome LIKE '%' || $1 || '%'
        `,
        [busca]

    )

    res.json(resultado.rows)


})

app.post('/responsavel', async (req, res) => {

    const { nome } = req.body;

    const resultado = await pool.query(
        `
            INSERT INTO responsavel (nome)
            VALUES ($1)
            RETURNING *
        `,
        [nome]
    )

    res.status(201).json({
        mensagem: "SUCESSO :: RESPONSAVEL CRIADO",
        resultado: resultado.rows[0]
    })

})

app.put('/responsavel/:id', async (req, res) => {

    const { id } = req.params;

    const { nome } = req.body;

    const resultado = await pool.query(
        `
            UPDATE responsavel
            SET
                nome = $1
            WHERE id = $2
            RETURNING *
        `,
        [nome, id]
    )

    if (resultado.rows.length === 0){

        res.status(401).json({
            mensagem:"ERRO :: "
        })

    }

    res.status(200).json({
        mensagem:"SUCESSO :: Responsavel atualizado",
        resultado: resultado.rows[0]
    })

})

app.delete('/responsavel/:id', async (req, res) => {

    const { id } = req.params;

    const resultado = await pool.query(
        `
            DELETE FROM responsavel WHERE id = $1 RETURNING *
        `,
        [id]
    )

    res.status(200).json({
        mensagem: "SUCESSO :: Reponsavel deletado",
        resultado: resultado.rows[0]
    })

})

app.post('/agendamento', async (req, res) => {

    const { usuario_id, aluno_id, data_agendamento } = req.body;

    const resultado = await pool.query(
        `
        INSERT INTO agendamento (usuario_id, aluno_id, data_agendamento)
        VALUES
        ($1, $2, $3)
        RETURNING *  
        `,
        [usuario_id, aluno_id, data_agendamento]
    )

    res.status(200).json({
        mensagem: "SUCESSO :: Agendamento realizado",
        resultado: resultado.rows[0]
    })

})

app.get('/agendamento', async (req, res) => {

    const resultado = await pool.query(
        `
        SELECT * FROM agendamento
        `
    )

    res.json(resultado.rows)

});

app.put('/agendamento/:id', async (req, res) => {

    const { id } = req.params;

    const { data_agendamento } = req.body;

    const resultado = await pool.query (
        `
        UPDATE agendamento
        SET data_agendamento = $1
        WHERE id = $2
        RETURNING *
        `,
        [data_agendamento, id]
    )

    res.status(200).json({
        mensagem: "SUCESSO :: Agendamento atualizado!",
        resultado: resultado.rows[0]
    })

})
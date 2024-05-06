const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 4000;

app.use(express.json());

const poll = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'terror',
    password: 'azul0404',
    port: 7007
});

app.get('/personagens', async (req, res) => {
    try {
        const { nome } = req.query;
        let query;
        let params;

        if (nome) {
            query = 'SELECT * FROM personagens WHERE nome ILIKE $1';
            params = [`%${nome}%`];
        } else {
            query = 'SELECT * FROM personagens';
            params = [];
        }

        const resultado = await poll.query(query, params);

        res.json({
            total: resultado.rowCount,
            personagens: resultado.rows
        });
    } catch (error) {
        console.error('Erro ao obter personagens', error);
        res.status(500).send('Erro ao obter personagens');
    }
});

app.post('/personagens' , async (req, res) => {
    try {
        const { nome, poder, arma, forca, vida } = req.body;
        await poll.query('INSERT INTO personagens (nome, poder, arma, forca, vida) VALUES ($1, $2, $3, $4, $5)', [nome, poder, arma, forca, vida]);
        res.status(201).send({ mensagem: 'Sucesso ao cadastrar personagem' })
    } catch (error) {
        console.error('Erro ao cadastrar personagem', error);
        res.status(500).send('Erro ao cadastrar personagem');
    }
});

app.put('/personagens/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, poder, arma, forca, vida } = req.body;
        await poll.query('UPDATE personagens SET nome = $1, poder = $2, arma = $3, forca = $4, vida = $5 WHERE id = $6', [nome, poder, arma, forca, vida, id]);
        res.status(200).send({ mensagem: 'Sucesso ao atualizar personagem' })
    } catch (error) {
        console.error('Erro ao atualizar personagem', error);
        res.status(500).send('Erro ao atualizar personagem');
    }
});
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

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

app.get('/batalha', async (req, res) => {
    try {
        let query;
        let params;

        if (req.query.nome) {
            query = 'SELECT tb.id,  tb.id_1, tb.id_2, tb.vencedor, tp.nome, tp.poder, tp.arma, tp.forca, tp.vida FROM personagens tp INNER JOIN batalhas tb ON tb.vencedor = tp.id WHERE tp.nome ILIKE $1';
            params = [req.query.nome];
        } else {
            query = 'SELECT tb.id_1, tb.id_2, tb.vencedor, tp.nome, tp.poder, tp.arma, tp.forca, tp.vida FROM personagens tp INNER JOIN batalhas tb ON tb.vencedor = tp.id';
            params = [];
        }

        const resultado = await poll.query(query, params);

        res.json({
            total: resultado.rowCount,
            batalhas: resultado.rows
        });
    } catch (error) {
        console.error('Erro ao obter batalhas', error);
        res.status(500).send('Erro ao obter batalhas');
    }
});


app.get('/batalha/:id_1/:id_2', async (req, res) => {
    try {
        const { id_1 } = req.params
        const { id_2 } = req.params;

        if (id_1 !== id_2) {
            let personagem_1 = await poll.query('SELECT * FROM personagens WHERE id = $1', [id_1]);
            personagem_1 = personagem_1.rows[0];
            const valor_batalha_1 = personagem_1.forca + personagem_1.vida;

            let personagem_2 = await poll.query('SELECT * FROM personagens WHERE id = $1', [id_2]);
            personagem_2 = personagem_2.rows[0];
            const valor_batalha_2 = personagem_2.forca + personagem_2.vida;

            if (valor_batalha_1 > valor_batalha_2) {
                res.json({
                    vencedor: id_1, 
                    nome: personagem_1.nome,
                    poder: personagem_1.poder,
                    arma: personagem_1.arma,
                    forca: personagem_1.forca,
                    vida: personagem_1.vida
                });
                await poll.query('INSERT INTO batalhas (id_1, id_2, vencedor) VALUES ($1, $2, $3)', [id_1, id_2, personagem_1.id]);
            } else if (valor_batalha_1 < valor_batalha_2) {
                res.json({
                    vencedor: id_2,
                    nome: personagem_2.nome,
                    poder: personagem_2.poder,
                    arma: personagem_2.arma,
                    forca: personagem_2.forca,
                    vida: personagem_2.vida
                });
                await poll.query('INSERT INTO batalhas (id_1, id_2, vencedor) VALUES ($1, $2, $3)', [id_1, id_2, personagem_2.id])
            } else {
                res.json({
                    empate: true
                });
                await poll.query('INSERT INTO batalhas (id_1, id_2, vencedor) VALUES ($1, $2, $3)', [id_1, id_2, undefined])
            }
        } else {
            res.status(500).send('Selecione dois personagens diferentes ')
        }
    } catch (error) {
        console.error('Erro ao batalhar personagens', error);
        res.status(500).send('Erro ao batalhar personagens');
    }
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

app.get('/personagens/:id', async (req, res) => {
    try {
        const { id } = req.params.id;
        const resultado = await poll.query('SELECT * FROM personagens WHERE id = $1', [id]);
        res.json({
            cadastros: resultado.rows
        });
    } catch (error) {
        console.error('Erro ao obter o personagem');
        res.status(500).send('Erro ao obter o personagem');
    }
});

app.post('/personagens', async (req, res) => {
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

app.delete('/personagens/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await poll.query('DELETE FROM personagens WHERE id = $1', [id]);
        res.status(200).send({ mensagem: 'Sucesso ao deletar personagem' })
    } catch (error) {
        console.error('Erro ao deletar personagem', error);
        res.status(500).send('Erro ao deletar personagem');
    }
});

app.get('/', (req, res) => {
    res.send('Server OK');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
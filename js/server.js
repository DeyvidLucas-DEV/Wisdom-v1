const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Configurações do PostgreSQL
const pool = new Pool({
    user: 'admin', // Seu usuário PostgreSQL
    host: 'localhost', // Host do PostgreSQL
    database: 'wisdomdb', // Nome do banco de dados
    password: 'Wisdom123!', // Sua senha
    port: 5433, // Porta do PostgreSQL (a mesma usada no contêiner)
});

// Endpoint para autenticar o login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Usuário e senha são obrigatórios.' });
    }

    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE username = $1 AND password = $2',
            [username, password]
        );

        if (result.rows.length > 0) {
            return res.status(200).json({ success: true, message: 'Login bem-sucedido!' });
        } else {
            return res.status(401).json({ success: false, message: 'Usuário ou senha inválidos.' });
        }
    } catch (error) {
        console.error('Erro no banco de dados:', error);
        return res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    }
});

// Inicia o servidor
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

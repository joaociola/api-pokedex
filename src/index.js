require('dotenv').config()
const express = require('express');
const rotas = require('./rotas');
const cors = require('cors');
const porta = process.env.PORTA || 3000
const app = express();

app.use(express.json());
app.use(cors());
app.use(rotas);

app.listen(porta);
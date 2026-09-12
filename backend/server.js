require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');



const app = express();

app.use(cors());
app.use(express.json());

// Importando as nossas rotas
const financeiroRoutes = require('./routes/financeiroRoutes');
const treinoRoutes = require('./routes/treinoRoutes');
const tarefaRoutes = require('./routes/tarefaRoutes');
const projetoRoutes = require('./routes/projetoRoutes');
const estudoRoutes = require('./routes/estudoRoutes');
const eventoRoutes = require('./routes/eventoRoutes');
const iaRoutes = require('./routes/iaRoutes');
const authRoutes = require('./routes/authRoutes');
const nutricaoRoutes = require('./routes/nutricaoRoutes');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('📦 Banco de dados MongoDB conectado!'))
  .catch((erro) => console.error('Erro ao conectar no banco:', erro));

// Dizendo para o Express usar as rotas
app.use('/api/financeiro', financeiroRoutes);
app.use('/api/treinos', treinoRoutes);
app.use('/api/tarefas', tarefaRoutes);
app.use('/api/projetos', projetoRoutes);
app.use('/api/estudos', estudoRoutes);
app.use('/api/eventos', eventoRoutes);
app.use('/api/ia', iaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/nutricao', nutricaoRoutes);

app.get('/api/status', (req, res) => {
  res.json({ message: 'LifeOS API está rodando perfeitamente e conectada ao banco!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor do LifeOS rodando na porta ${PORT}`);
});
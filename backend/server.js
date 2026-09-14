require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// 1. Importações dos Middlewares e Rotas
const verificarToken = require('./middleware/authMiddleware');
const authRoutes = require('./routes/authRoutes');
const financeiroRoutes = require('./routes/financeiroRoutes');
const treinoRoutes = require('./routes/treinoRoutes');
const tarefaRoutes = require('./routes/tarefaRoutes');
const projetoRoutes = require('./routes/projetoRoutes');
const estudoRoutes = require('./routes/estudoRoutes');
const eventoRoutes = require('./routes/eventoRoutes');
const iaRoutes = require('./routes/iaRoutes');
const nutricaoRoutes = require('./routes/nutricaoRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// 2. Conexão com o Banco de Dados
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('📦 Banco de dados MongoDB conectado!'))
  .catch((erro) => console.error('Erro ao conectar no banco:', erro));

// ==========================================
// 3. ZONA PÚBLICA (NÃO exige Token)
// ==========================================
app.use('/api/auth', authRoutes);
app.get('/api/status', (req, res) => {
  res.json({ message: 'LifeOS API está rodando perfeitamente e conectada ao banco!' });
});

// ==========================================
// 4. O SEGURANÇA (Verifica o Token)
// Todas as rotas abaixo desta linha estarão trancadas
// ==========================================
app.use(verificarToken);

// ==========================================
// 5. ZONA PRIVADA (Exige Token)
// ==========================================
app.use('/api/financeiro', financeiroRoutes);
app.use('/api/treinos', treinoRoutes);
app.use('/api/tarefas', tarefaRoutes);
app.use('/api/projetos', projetoRoutes);
app.use('/api/estudos', estudoRoutes);
app.use('/api/eventos', eventoRoutes);
app.use('/api/ia', iaRoutes);
app.use('/api/nutricao', nutricaoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor do LifeOS rodando na porta ${PORT}`);
});
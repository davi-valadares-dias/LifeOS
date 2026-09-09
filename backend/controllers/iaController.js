const { GoogleGenerativeAI } = require('@google/generative-ai');
const Tarefa = require('../models/Tarefa');
const Evento = require('../models/Evento');
const MensagemIA = require('../models/MensagemIA');
const Lancamento = require('../models/Lancamento'); 
const Treino = require('../models/Treino'); 
const Estudo = require('../models/Estudo'); 
const Projeto = require('../models/Projeto'); // <-- Adicionado o modelo de Projetos

const consultarIA = async (req, res) => {
  try {
    const { pergunta } = req.body;
    
    await MensagemIA.create({ papel: 'user', texto: pergunta });

    const tarefasPendentes = await Tarefa.find({ status: { $ne: 'Concluída' } });
    const historicoCru = await MensagemIA.find().sort({ data: -1 }).limit(20);
    const historico = historicoCru.reverse();
    const dataDeHoje = new Date().toLocaleDateString('pt-BR');

    // INSTRUÇÕES ATUALIZADAS: Adicionado comando criar_projeto
    const systemInstruction = `
      Você é o assistente virtual EXCLUSIVO do sistema LifeOS. Hoje é dia ${dataDeHoje}.
      
      [REGRA ABSOLUTA DE ESCOPO]
      Você SÓ DEVE conversar sobre a rotina, tarefas, treinos, faculdade/estudos, calendário, projetos de programação e finanças do usuário. 
      RECUSE EDUCADAMENTE qualquer pedido sobre outros assuntos (como escrever códigos em Python, dar receitas, contar piadas, etc). Responda sempre que o seu escopo é estritamente pessoal e focado no LifeOS.

      [REGRA ABSOLUTA PARA CRIAÇÃO DE DADOS]
      Se o usuário pedir para criar, registrar, adicionar ou salvar algo no sistema, responda ÚNICA e EXCLUSIVAMENTE com um código JSON válido. Não adicione nenhuma palavra antes ou depois do JSON.
      
      Formatos aceitos:
      Finanças: {"comando": "criar_financeiro", "descricao": "nome", "valor": 250.00, "tipo": "saida", "categoria": "nome"}
      Tarefas: {"comando": "criar_tarefa", "titulo": "nome", "categoria": "nome"}
      Treinos: {"comando": "criar_treino", "grupoMuscular": "Costas e Bíceps", "exerciciosFeitos": "descricao dos exercícios", "duracaoMinutos": 60}
      Faculdade: {"comando": "criar_estudo", "disciplina": "nome da materia", "professor": "nome do professor", "maxFaltas": 10}
      Calendário: {"comando": "criar_evento", "titulo": "nome do compromisso", "tipo": "Compromisso", "descricao": "detalhes"}
      Projetos: {"comando": "criar_projeto", "nome": "nome do projeto", "tecnologias": "React, Node, etc", "descricao": "descrição completa", "linkGithub": "url ou vazio"}
    `;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

    const historicoFormatado = historico.slice(0, -1).map(msg => ({
        role: msg.papel,
        parts: [{ text: msg.texto }]
    }));

    const chat = model.startChat({
      history: [
          { role: 'user', parts: [{ text: systemInstruction }] },
          { role: 'model', parts: [{ text: 'Entendido. Recusarei assuntos externos e responderei apenas com JSON se for um comando de criação.' }] },
          ...historicoFormatado
      ]
    });
    
    const resultado = await chat.sendMessage(pergunta);
    let respostaTexto = resultado.response.text();

    try {
      const match = respostaTexto.match(/\{[\s\S]*\}/);
      
      if (match) {
        const comando = JSON.parse(match[0]);
        
        if (comando.comando === 'criar_financeiro') {
          await Lancamento.create({
            descricao: comando.descricao,
            valor: Number(comando.valor),
            tipo: comando.tipo,
            categoria: comando.categoria,
            data: new Date()
          });
          respostaTexto = "✅ Financeiro atualizado.";
        } 
        else if (comando.comando === 'criar_tarefa') {
          await Tarefa.create({
            titulo: comando.titulo,
            status: 'Pendente',
            categoria: comando.categoria
          });
          respostaTexto = "✅ Tarefa criada.";
        }
        else if (comando.comando === 'criar_treino') {
          await Treino.create({
            grupoMuscular: comando.grupoMuscular,
            exerciciosFeitos: comando.exerciciosFeitos,
            duracaoMinutos: Number(comando.duracaoMinutos),
            data: new Date()
          });
          respostaTexto = "✅ Treino registrado no diário.";
        }
        else if (comando.comando === 'criar_estudo') {
          await Estudo.create({
            disciplina: comando.disciplina,
            professor: comando.professor,
            maxFaltas: Number(comando.maxFaltas),
            faltas: 0
          });
          respostaTexto = "✅ Matéria adicionada ao painel da faculdade.";
        }
        else if (comando.comando === 'criar_evento') {
          await Evento.create({
            titulo: comando.titulo,
            tipo: comando.tipo,
            descricao: comando.descricao,
            data: new Date()
          });
          respostaTexto = "✅ Evento adicionado ao calendário de hoje.";
        }
        // <-- AQUI ESTÁ A LÓGICA NOVA PARA PROJETOS
        else if (comando.comando === 'criar_projeto') {
          await Projeto.create({
            nome: comando.nome,
            descricao: comando.descricao,
            tecnologias: comando.tecnologias,
            linkGithub: comando.linkGithub || ''
          });
          respostaTexto = "✅ Projeto adicionado ao seu portfólio.";
        }
      }
    } catch (e) {
      console.error("ERRO AO TENTAR SALVAR NO BANCO:", e.message);
    }

    await MensagemIA.create({ papel: 'model', texto: respostaTexto });
    res.status(200).json({ resposta: respostaTexto });

  } catch (erro) {
    console.error('Erro na IA:', erro);
    res.status(500).json({ mensagem: 'Erro ao consultar a IA', erro: erro.message });
  }
};

const listarHistorico = async (req, res) => {
  try {
    const historico = await MensagemIA.find().sort({ data: 1 });
    res.status(200).json(historico);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro', erro: erro.message });
  }
};

const limparHistorico = async (req, res) => {
  try {
    await MensagemIA.deleteMany({});
    res.status(200).json({ mensagem: 'Limpo' });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro', erro: erro.message });
  }
}

module.exports = { consultarIA, listarHistorico, limparHistorico };
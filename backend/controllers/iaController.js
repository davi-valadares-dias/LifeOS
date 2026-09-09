const { GoogleGenerativeAI } = require('@google/generative-ai');
const Tarefa = require('../models/Tarefa');
const Evento = require('../models/Evento');
const MensagemIA = require('../models/MensagemIA');
const Lancamento = require('../models/Lancamento'); 

const consultarIA = async (req, res) => {
  try {
    const { pergunta } = req.body;
    
    await MensagemIA.create({ papel: 'user', texto: pergunta });

    const tarefasPendentes = await Tarefa.find({ status: { $ne: 'Concluída' } });
    const historicoCru = await MensagemIA.find().sort({ data: -1 }).limit(20);
    const historico = historicoCru.reverse();
    const dataDeHoje = new Date().toLocaleDateString('pt-BR');

    // INSTRUÇÕES ATUALIZADAS PARA EXIGIR CATEGORIA TAMBÉM NAS TAREFAS
    const systemInstruction = `
      Você é o assistente virtual do sistema LifeOS. Hoje é dia ${dataDeHoje}.
      
      [REGRA ABSOLUTA PARA CRIAÇÃO DE DADOS]
      Se o usuário pedir para criar, registrar, adicionar ou salvar algo no sistema, responda ÚNICA e EXCLUSIVAMENTE com um código JSON válido. Não adicione nenhuma palavra antes ou depois.
      
      Para finanças:
      {"comando": "criar_financeiro", "descricao": "nome da transacao", "valor": 250.00, "tipo": "saida", "categoria": "nome da categoria"}
      
      Para tarefas:
      {"comando": "criar_tarefa", "titulo": "nome da tarefa", "categoria": "nome da categoria"}
      (Obs: Crie uma categoria curta e coerente, ex: Faculdade, Casa, Trabalho, Saúde).
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
          { role: 'model', parts: [{ text: 'Entendido. Responderei apenas com JSON se for um comando de criação.' }] },
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
          // AGORA PASSAMOS A CATEGORIA DA TAREFA PARA O BANCO DE DADOS
          await Tarefa.create({
            titulo: comando.titulo,
            status: 'Pendente',
            categoria: comando.categoria
          });
          respostaTexto = "✅ Tarefa criada.";
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
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Tarefa = require('../models/Tarefa');
const Evento = require('../models/Evento');
const MensagemIA = require('../models/MensagemIA');
const Lancamento = require('../models/Lancamento'); 
const Treino = require('../models/Treino'); 
const Estudo = require('../models/Estudo'); 
const Projeto = require('../models/Projeto'); 
const Alimento = require('../models/Alimento'); 
const Refeicao = require('../models/Refeicao'); 

const consultarIA = async (req, res) => {
  try {
    const { pergunta } = req.body;
    const donoId = req.usuario.id; // Pega a identidade do usuário logado
    
    // Salva a mensagem vinculada ao usuário
    await MensagemIA.create({ papel: 'user', texto: pergunta, usuarioId: donoId });

    const historicoCru = await MensagemIA.find({ usuarioId: donoId }).sort({ data: -1 }).limit(20);
    const historico = historicoCru.reverse();
    const dataDeHoje = new Date().toLocaleDateString('pt-BR');

    const systemInstruction = `
      Você é o assistente virtual EXCLUSIVO do sistema LifeOS. Hoje é dia ${dataDeHoje}.
      Você SÓ DEVE conversar sobre a rotina, tarefas, treinos, faculdade/estudos, calendário, projetos de programação, nutrição e finanças do usuário. 
      RECUSE EDUCADAMENTE qualquer pedido sobre outros assuntos.

      [REGRA ABSOLUTA PARA CRIAÇÃO DE DADOS]
      Se o usuário pedir para criar ou registrar algo no sistema, responda ÚNICA e EXCLUSIVAMENTE com um código JSON válido. Nenhuma palavra a mais.
      
      Formatos aceitos:
      Finanças: {"comando": "criar_financeiro", "descricao": "nome", "valor": 250.00, "tipo": "saida", "categoria": "nome"}
      Tarefas: {"comando": "criar_tarefa", "titulo": "nome", "categoria": "nome"}
      Treinos: {"comando": "criar_treino", "grupoMuscular": "Costas", "exerciciosFeitos": "detalhes", "duracaoMinutos": 60}
      Faculdade: {"comando": "criar_estudo", "disciplina": "materia", "professor": "nome", "maxFaltas": 10}
      Calendário: {"comando": "criar_evento", "titulo": "nome", "tipo": "Compromisso", "descricao": "detalhes"}
      Projetos: {"comando": "criar_projeto", "nome": "nome", "tecnologias": "React", "descricao": "desc", "linkGithub": ""}
      Nutrição: {"comando": "criar_refeicao", "tipo": "Almoço", "itens": [{"nome": "Arroz branco", "quantidadeGramas": 200}, {"nome": "Feijão carioca", "quantidadeGramas": 150}]}
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
          { role: 'model', parts: [{ text: 'Entendido. Responderei apenas com JSON se for comando de criação.' }] },
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
          await Lancamento.create({ descricao: comando.descricao, valor: Number(comando.valor), tipo: comando.tipo, categoria: comando.categoria, data: new Date(), usuarioId: donoId });
          respostaTexto = "✅ Financeiro atualizado.";
        } 
        else if (comando.comando === 'criar_tarefa') {
          await Tarefa.create({ titulo: comando.titulo, status: 'Pendente', categoria: comando.categoria, usuarioId: donoId });
          respostaTexto = "✅ Tarefa criada.";
        }
        else if (comando.comando === 'criar_treino') {
          await Treino.create({ grupoMuscular: comando.grupoMuscular, exerciciosFeitos: comando.exerciciosFeitos, duracaoMinutos: Number(comando.duracaoMinutos), data: new Date(), usuarioId: donoId });
          respostaTexto = "✅ Treino registrado.";
        }
        else if (comando.comando === 'criar_estudo') {
          await Estudo.create({ nome: comando.disciplina, professor: comando.professor, faltas: 0, usuarioId: donoId });
          respostaTexto = "✅ Matéria adicionada.";
        }
        else if (comando.comando === 'criar_evento') {
          await Evento.create({ titulo: comando.titulo, tipo: comando.tipo, descricao: comando.descricao, data: new Date(), usuarioId: donoId });
          respostaTexto = "✅ Evento marcado.";
        }
        else if (comando.comando === 'criar_projeto') {
          await Projeto.create({ nome: comando.nome, descricao: comando.descricao, tecnologias: comando.tecnologias, linkGithub: comando.linkGithub || '', usuarioId: donoId });
          respostaTexto = "✅ Projeto salvo.";
        }
        else if (comando.comando === 'criar_refeicao') {
          let itensProcessados = [];
          let totais = { calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0, acucares: 0 };

          for (let item of comando.itens) {
            // Busca o alimento na base global ou do próprio usuário
            const alimentoDB = await Alimento.findOne({ nome: { $regex: new RegExp(item.nome, 'i') } });
            
            if (alimentoDB) {
              const proporcao = item.quantidadeGramas / 100;
              totais.calorias += alimentoDB.calorias * proporcao;
              totais.proteinas += alimentoDB.proteinas * proporcao;
              totais.carboidratos += alimentoDB.carboidratos * proporcao;
              totais.gorduras += alimentoDB.gorduras * proporcao;
              totais.acucares += (alimentoDB.acucares || 0) * proporcao;

              itensProcessados.push({
                alimentoId: alimentoDB._id,
                nomeSnapshot: alimentoDB.nome,
                quantidadeGramas: item.quantidadeGramas
              });
            }
          }

          if (itensProcessados.length > 0) {
            await Refeicao.create({ tipo: comando.tipo, data: new Date(), itens: itensProcessados, totais, usuarioId: donoId });
            respostaTexto = "✅ Refeição registrada e macros calculados no seu diário!";
          } else {
            respostaTexto = "❌ Não consegui encontrar os alimentos informados na sua base de dados. Tente usar o nome exato.";
          }
        }
      }
    } catch (e) {
      console.error("ERRO AO TENTAR SALVAR NO BANCO VIA IA:", e.message);
    }

    // Salva a resposta da IA vinculada ao usuário
    await MensagemIA.create({ papel: 'model', texto: respostaTexto, usuarioId: donoId });
    res.status(200).json({ resposta: respostaTexto });

  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao consultar a IA', erro: erro.message });
  }
};

const listarHistorico = async (req, res) => {
  try {
    const donoId = req.usuario.id;
    const historico = await MensagemIA.find({ usuarioId: donoId }).sort({ data: 1 });
    res.status(200).json(historico);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro', erro: erro.message });
  }
};

const limparHistorico = async (req, res) => {
  try {
    const donoId = req.usuario.id;
    await MensagemIA.deleteMany({ usuarioId: donoId });
    res.status(200).json({ mensagem: 'Limpo' });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro', erro: erro.message });
  }
}

module.exports = { consultarIA, listarHistorico, limparHistorico };
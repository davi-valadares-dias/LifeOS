const mongoose = require('mongoose');
const xlsx = require('xlsx');
const Alimento = require('./models/Alimento');
require('dotenv').config();

const importar = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('⏳ Conectado ao banco. Lendo arquivo...');

    const workbook = xlsx.readFile('base-de-dados-alimentos.xlsx');
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    
    // range: 2 pula as duas primeiras linhas de cabeçalho da sua planilha
    const colunas = ['nome', 'categoria', 'preparo', 'calorias', 'proteinas', 'carboidratos', 'gorduras', 'acucares'];
    const dados = xlsx.utils.sheet_to_json(sheet, { range: 2, header: colunas });

    const alimentosFormatados = dados.map(item => ({
      nome: item.preparo ? `${item.nome} (${item.preparo})` : item.nome,
      categoria: item.categoria || 'Outros',
      calorias: Number(item.calorias) || 0,
      proteinas: Number(item.proteinas) || 0,
      carboidratos: Number(item.carboidratos) || 0,
      gorduras: Number(item.gorduras) || 0,
      acucares: Number(item.acucares) || 0
    }));

    await Alimento.insertMany(alimentosFormatados);
    console.log(`✅ Sucesso! ${alimentosFormatados.length} alimentos cadastrados.`);
    process.exit();
  } catch (erro) {
    console.error('❌ Erro na importação:', erro);
    process.exit(1);
  }
};

importar();
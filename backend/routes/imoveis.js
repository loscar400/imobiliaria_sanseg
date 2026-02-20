const express = require('express');
const Imovel = require('../models/imovel');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ======================================
// 📂 GARANTE QUE A PASTA UPLOADS EXISTE
// ======================================
const uploadDir = path.join(__dirname, '..', 'uploads', 'imoveis');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ======================================
// 🖼️ CONFIGURAÇÕES DO MULTER (UPLOAD)
// ======================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });


// ======================================
// 🔢 GERA CÓDIGO IMV AUTOMÁTICO
// ======================================
async function gerarCodigoImovel() {
  const ultimo = await Imovel.findOne().sort({ createdAt: -1 });

  if (!ultimo || !ultimo.codigo) return 'IMV0001';

  const numero = parseInt(ultimo.codigo.replace('IMV', '')) + 1;
  return 'IMV' + numero.toString().padStart(4, '0');
}


// ======================================
// 🏠 CADASTRAR IMÓVEL
// ======================================
router.post('/', upload.array('imagens', 20), async (req, res) => {
  try {
    //console.log("BODY RECEBIDO:", req.body);

    const codigoGerado = await gerarCodigoImovel();

    // ✅ TRATAMENTO CORRETO
    const imagens = req.files && req.files.length > 0
      ? req.files.map(f => `/uploads/imoveis/${f.filename}`)
      : [];

    const imovel = new Imovel({
      codigo: codigoGerado,
      ...req.body,
      preco: Number(req.body.preco) || 0,
      quartos: Number(req.body.quartos) || 0,
      banheiros: Number(req.body.banheiros) || 0,
      salas: Number(req.body.salas) || 0,
      cozinhas: Number(req.body.cozinhas) || 0,
      suites: Number(req.body.suites) || 0,
      garagem: Number(req.body.garagem) || 0,
      areaTotal: Number(req.body.areaTotal) || 0,
      areaConstruida: Number(req.body.areaConstruida) || 0,
      imagens
    });

    await imovel.save();

    res.status(201).json({
      message: "Imóvel cadastrado com sucesso!",
      imovel
    });

  } catch (err) {
    console.error("Erro ao cadastrar:", err);
    res.status(500).json({ error: err.message });
  }
});




// ======================================
// 🔍 LISTAR / FILTRAR IMÓVEIS
// ======================================
router.get('/', async (req, res) => {
  try {
    const {
      tipo,
      cidade,
      bairro,
      quartos,
      minPreco,
      maxPreco,
      busca
    } = req.query;

    const filtro = {};

    // 🔎 Tipo = título do imóvel (Casa, Apartamento, etc.)
    if (tipo) filtro.titulo = new RegExp(tipo, "i");

    if (cidade) filtro.cidade = cidade;
    if (bairro) filtro.bairro = bairro;
    if (quartos) filtro.quartos = Number(quartos);

    // 💰 Filtro de preço
    if (minPreco || maxPreco) {
      filtro.preco = {};
      if (minPreco) filtro.preco.$gte = Number(minPreco);
      if (maxPreco) filtro.preco.$lte = Number(maxPreco);
    }

    // 🧠 Busca inteligente (título, endereço, descrição)
    if (busca) {
      filtro.$or = [
        { titulo: new RegExp(busca, "i") },
        { descricao: new RegExp(busca, "i") },
        { endereco: new RegExp(busca, "i") }
      ];
    }

    const imoveis = await Imovel.find(filtro).sort({ createdAt: -1 });
    res.json({ data: imoveis });

  } catch (err) {
    console.error("Erro ao buscar imóveis:", err);
    res.status(500).json({ error: "Erro ao buscar imóveis." });
  }
});


// ======================================
// 📌 LISTAR IMÓVEL POR ID
// ======================================
router.get('/:id', async (req, res) => {
  try {
    const imovel = await Imovel.findById(req.params.id);
    if (!imovel) return res.status(404).json({ error: "Imóvel não encontrado" });

    res.json({ data: imovel });

  } catch (err) {
    res.status(400).json({ error: "ID inválido" });
  }
});


// ======================================
// ✏️ EDITAR IMÓVEL
// ======================================
router.put('/:id', upload.array('imagens', 20), async (req, res) => {
  try {
    const updates = {};

    const campos = [
      "titulo", "descricao", "endereco", "preco", "tipo",
      "cidade", "bairro", "quartos", "banheiros", "salas",
      "cozinhas", "suites", "garagem", "areaTotal", "areaConstruida"
    ];

    // 🧽 Só atualiza o que veio
    campos.forEach(campo => {
      if (req.body[campo] !== undefined && req.body[campo] !== "") {
        updates[campo] = req.body[campo];
      }
    });

    // 💰 Converter preço
    if (updates.preco) {
      updates.preco = Number(updates.preco.toString().replace(/\D/g, ""));
    }

    if (updates.areaTotal) {
      updates.areaTotal = Number(updates.areaTotal);
    }

    if (updates.areaConstruida) {
      updates.areaConstruida = Number(updates.areaConstruida);
    }

    // 🖼️ Atualizar imagens
    // 🖼️ Atualizar imagens corretamente
    const imovelAtual = await Imovel.findById(req.params.id);

    let imagensAtuais = imovelAtual.imagens || [];

    if (req.files && req.files.length > 0) {

      const novasImagens = req.files.map(f =>
        `/uploads/imoveis/${f.filename}`
      );

      updates.imagens = [...imagensAtuais, ...novasImagens];

    } else {
      updates.imagens = imagensAtuais;
    }

    const imovel = await Imovel.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json({ message: "Imóvel atualizado!", data: imovel });

  } catch (err) {
    console.error("Erro ao atualizar:", err);
    res.status(400).json({ error: "Erro ao atualizar" });
  }
});


// ======================================
// 🗑 REMOVER IMÓVEL
// ======================================
router.delete('/:id', async (req, res) => {
  try {
    const imovel = await Imovel.findByIdAndDelete(req.params.id);

    if (!imovel) return res.status(404).json({ error: "Imóvel não encontrado" });

    // 🧹 Remover imagens do diretório
    if (imovel.imagens) {
      imovel.imagens.forEach(img => {
        const caminho = path.join(__dirname, "..", img);
        if (fs.existsSync(caminho)) fs.unlinkSync(caminho);
      });
    }

    res.json({ message: "Imóvel removido!" });

  } catch (err) {
    res.status(400).json({ error: "Erro ao remover" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const Imovel = require("../models/imovel");
const Cliente = require("../models/cliente");

// ===============================
// DASHBOARD - RESUMO GERAL
// ===============================
router.get("/", async (req, res) => {
  try {
    // Total de imóveis cadastrados
    const totalImoveis = await Imovel.countDocuments();

    // Total de imóveis vendidos (finalidade = VENDA)
    const imoveisVendidos = await Imovel.countDocuments({
      finalidade: "VENDA"
    });

    // Total de clientes cadastrados
    const totalClientes = await Cliente.countDocuments();

    res.json({
      totalImoveis: totalImoveis,
      imoveisVendidos: imoveisVendidos,
      totalClientes: totalClientes
    });

  } catch (err) {
    console.error("Erro no dashboard:", err);
    res.status(500).json({
      error: "Erro ao carregar dados do dashboard"
    });
  }
});

module.exports = router;

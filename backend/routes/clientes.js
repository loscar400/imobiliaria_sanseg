const express = require("express");
const router = express.Router();
const Cliente = require("../models/cliente");

// =======================
// LISTAR CLIENTES
// =======================
router.get("/", async (req, res) => {
  try {
    const clientes = await Cliente.find().sort({ createdAt: -1 });
    res.json({ data: clientes });
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar clientes" });
  }
});

// =======================
// BUSCAR CLIENTE POR ID
// =======================
router.get("/:id", async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);

    if (!cliente) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    res.json({ data: cliente });
  } catch (err) {
    res.status(400).json({ error: "ID inválido" });
  }
});


// =======================
// CADASTRAR CLIENTE
// =======================
router.post("/", async (req, res) => {
  try {
    const novoCliente = new Cliente(req.body);
    await novoCliente.save();

    res.status(201).json({
      message: "Cliente cadastrado com sucesso",
      cliente: novoCliente
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// =======================
// ATUALIZAR CLIENTE
// =======================
router.put("/:id", async (req, res) => {
  try {
    await Cliente.findByIdAndUpdate(req.params.id, req.body);
    res.sendStatus(204);
  } catch (err) {
    res.status(400).json({ error: "Erro ao atualizar cliente" });
  }
});

// =======================
// EXCLUIR CLIENTE
// =======================
router.delete("/:id", async (req, res) => {
  try {
    await Cliente.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(400).json({ error: "Erro ao excluir cliente" });
  }
});



module.exports = router;

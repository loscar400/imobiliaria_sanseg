const express = require("express");
const router = express.Router();
const Proprietario = require("../models/proprietario");

// LISTAR
router.get("/", async (req, res) => {
  try {
    const lista = await Proprietario.find().sort({ createdAt: -1 });
    res.json({ data: lista });
  } catch {
    res.status(500).json({ error: "Erro ao listar proprietários" });
  }
});

// BUSCAR POR ID
router.get("/:id", async (req, res) => {
  try {
    const prop = await Proprietario.findById(req.params.id);
    if (!prop) return res.status(404).json({ error: "Não encontrado" });
    res.json(prop);
  } catch {
    res.status(400).json({ error: "ID inválido" });
  }
});

// CADASTRAR
router.post("/", async (req, res) => {
  try {
    const novo = new Proprietario(req.body);
    await novo.save();
    res.status(201).json(novo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ATUALIZAR
router.put("/:id", async (req, res) => {
  try {
    await Proprietario.findByIdAndUpdate(req.params.id, req.body);
    res.sendStatus(204);
  } catch {
    res.status(400).json({ error: "Erro ao atualizar" });
  }
});

// EXCLUIR
router.delete("/:id", async (req, res) => {
  try {
    await Proprietario.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch {
    res.status(400).json({ error: "Erro ao excluir" });
  }
});

module.exports = router;

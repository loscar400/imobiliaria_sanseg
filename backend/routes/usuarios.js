const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/usuario");

// Rota de registro
router.post("/registro", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ error: "Preencha todos os campos." });
    }

    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ error: "E-mail já cadastrado." });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const novoUsuario = new User({
      nome,
      email,
      senha: senhaHash
    });

    await novoUsuario.save();

    res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
  } catch (err) {
    console.error("Erro no registro:", err);
    res.status(500).json({ error: "Erro no servidor." });
  }
});

// Rota de login
router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: "Preencha todos os campos." });
    }

    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ error: "Usuário não encontrado." });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(400).json({ error: "Senha inválida." });
    }

    res.json({
      message: "Login realizado com sucesso",
      user: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role
      }
    });
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ error: "Erro no servidor." });
  }
});


// 🔥 ROTA SECRETA PARA RESETAR SENHA DO ADMIN 🔥
// Acesse: http://localhost:3000/api/usuarios/reset-admin
router.get("/reset-admin", async (req, res) => {
  try {
    const admin = await User.findOne({ email: "admin@admin.com" });

    if (!admin) {
      return res.status(404).json({ error: "Admin não encontrado." });
    }

    const novaSenha = "123456";
    const senhaHash = await bcrypt.hash(novaSenha, 10);

    admin.senha = senhaHash;
    admin.role = "admin";   // garante que é admin
    await admin.save();

    res.json({ message: "Senha do admin redefinida para 123456!" });

  } catch (err) {
    console.error("Erro ao resetar admin:", err);
    res.status(500).json({ error: "Erro ao resetar senha do admin" });
  }
});


module.exports = router;
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/usuario");

async function criarUsuario() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = "admin@local.com";

    const existe = await User.findOne({ email });
    if (existe) {
      console.log("❌ Usuário já existe");
      process.exit();
    }

    const senhaHash = await bcrypt.hash("123456", 10);

    const user = new User({
      nome: "Admin Local",
      email,
      senha: senhaHash,
      role: "admin"
    });

    await user.save();
    console.log("✅ Usuário criado com sucesso!");
    console.log("📧 Email:", email);
    console.log("🔑 Senha: 123456");

    process.exit();
  } catch (err) {
    console.error("❌ Erro:", err);
    process.exit(1);
  }
}

criarUsuario();
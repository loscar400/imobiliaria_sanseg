const mongoose = require("mongoose");

const ProprietarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  telefone: String,
  cpf: String,
  email: String,

  endereco: String,
  cidade: String,
  bairro: String,
  uf: String,

  observacoes: String
}, { timestamps: true });

module.exports = mongoose.model("Proprietario", ProprietarioSchema);

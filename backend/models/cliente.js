const mongoose = require("mongoose");

const ClienteSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  telefone: String,
  cpf: String,
  email: String,
  captador: String,

  // ✅ ENDEREÇO
  cep: String,
  endereco: String,
  bairro: String,
  cidade: String,
  uf: String,

  propostas: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Cliente", ClienteSchema);

const mongoose = require("mongoose");

const ImovelSchema = new mongoose.Schema({

  codigo: { 
    type: String, 
    required: true, 
    unique: true 
  },

  titulo: { 
    type: String, 
    required: true 
  },

  descricao: { 
    type: String, 
    required: true 
  },

  tipo: { 
    type: String, 
    enum: ["CASA", "APARTAMENTO", "TERRENO"], 
    default: "CASA"
  },

  finalidade: {
    type: String,
    enum: ["VENDA", "ALUGUEL"],
    default: "VENDA"
  },

  status: { 
    type: String,
    enum: ["DISPONIVEL", "VENDIDO", "ALUGADO"],
    default: "DISPONIVEL"
  },

  captador: { 
    type: String, 
    required: true 
  },

  proprietario: { 
    type: String, 
    required: true 
  },

  endereco: { 
    type: String, 
    required: true 
  },

  cidade: { 
    type: String, 
    required: true 
  },

  bairro: { 
    type: String, 
    required: true 
  },

  preco: { 
    type: Number, 
    required: true,
    min: 0
  },

  areaTotal: { 
    type: Number, 
    required: true
  },

  areaConstruida: { 
    type: Number
  },

  quartos: Number,
  banheiros: Number,
  salas: Number,
  cozinhas: Number,
  suites: Number,
  garagem: Number,

  imagens: [{ type: String }]

}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});


// 🔥 Virtual - preço por metro quadrado
ImovelSchema.virtual("precoPorMetro").get(function () {
  if (!this.areaTotal || this.areaTotal === 0) return 0;
  return (this.preco / this.areaTotal).toFixed(2);
});

module.exports = mongoose.model("Imovel", ImovelSchema);
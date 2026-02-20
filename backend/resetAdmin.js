const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User'); // ajuste o caminho

mongoose.connect("mongodb+srv://AtlasAdmin:10203040@imobiliaria.wphasim.mongodb.net/IMOBILIARIA?retryWrites=true&w=majority");

async function reset() {
  const hash = await bcrypt.hash('NovaSenha123', 10);

  await User.updateOne(
    { email: 'admin@admin.com' },
    { $set: { password: hash } }
  );

  console.log('Senha redefinida com sucesso');
  process.exit();
}

reset();

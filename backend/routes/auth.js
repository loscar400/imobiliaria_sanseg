/*const express = require ("express");
const bcrypt = require ("bcryptjs");
const jwt = require ("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();

//REGISTRO DE USUÁRIO

router.post("/registrar", async (req, res) => {
    try {
        const {nome, email, senha } = req.body;

    //VERIFICACAO SE USER JA REGISTRAOD
    const existingUser = await User.findOne({email});
    if (existingUser) return res.sendStatus(400).json({ error: "Email já cadastrado"});

    //CRIPTOGRAFIA DE SENHA
    const hashedPassword = await bcrypt.hash(senha, 10);
    const newUser = new User({ nome, email, senha: hashedPassword});
    await newUser.save();

    res.json({ message: "Usuário cadastrado com sucesso!"});
} catch (err){
    res.status(500).json( {error: "Erro ao cadastrar usuário"});
    }
});

//LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, senha } = req.body;

        const user = await User.findOne({email});
        if (!user) return res.sendStatus(400).json({error: "Usuário não encontrado"});
        
        const validPass = await bcrypt.compare(senha, user.senha);
        if (!validPass) return res.status(400).json({error: "Senha inválida"});

        //GERACAO DE TOKEN
        const token = jwt.sign(
            { id: user._id, email: user.email},
            "SECRET_KEY",// DEPOIS TEM QUE TROCAR PARA VARIÁVEL DE AMBIENTE
            { expiresIn: "1h"}
        );

        res.json({message: "Login realizado! Bem-vindo(a)", token});
    } catch (err) {
        res.status(500).json({ error: "Erro no processo de login"});
    }
});

module.exports = router;*/
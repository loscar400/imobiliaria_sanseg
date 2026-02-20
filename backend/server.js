const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("./models/usuario");

const app = express();

require("dotenv").config();

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;
const MONGO_URI = process.env.MONGO_URI;

//MIDDLE e CORS
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// CONEXÃO COM MONGO
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("Conectado no banco Mongo"))
    .catch(err => console.error("Erro ao conectar no banco de dados", err));

//PARTE DA AUTENTICAÇÃO
function autenticarToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, usuario) => {
        if (err) return res.sendStatus(403);
        req.usuario = usuario;
        next();
    });
}


//API DAS ROTAS
const imoveisRoutes = require("./routes/imoveis");
app.use("/api/imoveis", imoveisRoutes);

const clientesRoutes = require("./routes/clientes");
app.use("/api/clientes", clientesRoutes);


app.get("/admin", (req, res) => {
    res.redirect("/admin/admin-dashboard.html");
});


//FRONTEND
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/login.html"));
});

app.get("/detalhes", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/detalhe.html"));
});

const usuariosRoutes = require("./routes/usuarios");
app.use("/api/usuarios", usuariosRoutes)

const proprietariosRoutes = require("./routes/proprietarios");
app.use("/api/proprietarios", proprietariosRoutes);

const dashboardRoutes = require("./routes/dashboard");
app.use("/api/dashboard", dashboardRoutes);





// ROTAS DO ADMIN
app.get("/admin", (req, res) => {
    res.redirect("/admin/admin-dashboard.html");
});

app.use('/admin', express.static(path.join(__dirname, '../frontend/admin')));

app.get("/admin/admin-dashboard.html", (req, res) => {
    res.sendFile(
        path.join(__dirname, "../frontend/admin/admin-dashboard.html")
    );
});


// SERVER LIGADO
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
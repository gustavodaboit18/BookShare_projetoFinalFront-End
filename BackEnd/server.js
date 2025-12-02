const express = require("express");
const cors = require("cors");
require('dotenv').config();

const booksRoutes = require("./routes/booksRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/payments")
const comprovantes = require("./gerarComprovantePDF")

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rotas
app.use("/books", booksRoutes);
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/payments", paymentRoutes);
app.use("/comprovantes", comprovantes);


app.get("/", (req, res) => {
  res.send("Servidor BookShare funcionando!");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});



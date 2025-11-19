const express = require("express");
const cors = require("cors");
const booksRoutes = require("./routes/booksRoutes");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use("/books", booksRoutes);

app.get("/", (req, res) => {
  res.send("Servidor Express funcionando!");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

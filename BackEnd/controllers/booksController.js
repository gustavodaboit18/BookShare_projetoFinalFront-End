const { getAllBooks, addBook } = require("../models/booksModel");

function listBooks(req, res) {
  res.json(getAllBooks());
}

function createBook(req, res) {
  const { title, author } = req.body;
  if (!title || !author) {
    return res.status(400).json({ error: "Title and author are required" });
  }
  const newBook = addBook({ title, author });
  res.status(201).json(newBook);
}

module.exports = { listBooks, createBook };

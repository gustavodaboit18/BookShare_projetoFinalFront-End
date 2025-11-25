const booksModel = require('../models/booksModel');

// Listar todos os livros
async function listBooks(req, res) {
  try {
    const books = await booksModel.getAllBooks();
    res.json(books);
  } catch (error) {
    console.error('Erro ao listar livros:', error);
    res.status(500).json({ error: 'Erro ao listar livros' });
  }
}

// Obter livro por ID
async function getBook(req, res) {
  try {
    const { id } = req.params;
    const book = await booksModel.getBookById(id);
    
    if (!book) {
      return res.status(404).json({ error: 'Livro não encontrado' });
    }
    
    res.json(book);
  } catch (error) {
    console.error('Erro ao obter livro:', error);
    res.status(500).json({ error: 'Erro ao obter livro' });
  }
}

// Obter livros por usuário
async function getBooksByUser(req, res) {
  try {
    const { userId } = req.params;
    const books = await booksModel.getBooksByUserId(userId);
    res.json(books);
  } catch (error) {
    console.error('Erro ao obter livros do usuário:', error);
    res.status(500).json({ error: 'Erro ao obter livros do usuário' });
  }
}

// Criar novo livro
async function createBook(req, res) {
  try {
    const bookData = req.body;
    const newBook = await booksModel.createBook(bookData);
    res.status(201).json(newBook);
  } catch (error) {
    console.error('Erro ao criar livro:', error);
    res.status(500).json({ error: 'Erro ao criar livro' });
  }
}

// Atualizar livro
async function updateBook(req, res) {
  try {
    const { id } = req.params;
    const bookData = req.body;
    
    const updatedBook = await booksModel.updateBook(id, bookData);
    
    if (!updatedBook) {
      return res.status(404).json({ error: 'Livro não encontrado' });
    }
    
    res.json(updatedBook);
  } catch (error) {
    console.error('Erro ao atualizar livro:', error);
    res.status(500).json({ error: 'Erro ao atualizar livro' });
  }
}

// Deletar livro
async function deleteBook(req, res) {
  try {
    const { id } = req.params;
    await booksModel.deleteBook(id);
    res.json({ message: 'Livro deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar livro:', error);
    res.status(500).json({ error: 'Erro ao deletar livro' });
  }
}

module.exports = {
  listBooks,
  getBook,
  getBooksByUser,
  createBook,
  updateBook,
  deleteBook
};

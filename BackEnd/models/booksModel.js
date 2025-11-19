const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "../data/books.json");

function readDB() {
  if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, "[]");
  return JSON.parse(fs.readFileSync(DB_PATH));
}

function saveDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function getAllBooks() {
  return readDB();
}

function addBook(book) {
  const books = readDB();
  const newBook = { id: Date.now(), ...book };
  books.push(newBook);
  saveDB(books);
  return newBook;
}

module.exports = { getAllBooks, addBook };

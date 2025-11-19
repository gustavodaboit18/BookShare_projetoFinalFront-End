import axios from "axios";

const API_URL = "http://localhost:3000/books"; 

export async function createBook(book) {
  const res = await axios.post(API_URL, book);
  return res.data;
}

export async function listBooks() {
  const res = await axios.get(API_URL);
  return res.data;
}

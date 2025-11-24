import axios from "axios";

const API_URL = "http://localhost:3000/books";

export async function listBooks() {
  return (await axios.get(API_URL)).data;
}

export async function createBook(book) {
  return (await axios.post(API_URL, book)).data;
}

export async function updateBook(id, book) {
  const res = await axios.put(`${API_URL}/${id}`, book);
  return res.data;
}

export async function deleteBook(id) {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
}

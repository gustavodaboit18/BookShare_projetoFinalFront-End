const pool = require('../config/database');

// Obter todos os livros com informações do usuário
async function getAllBooks() {
  const result = await pool.query(`
    SELECT 
      b.*,
      u.name as user_name,
      u.email as user_email,
      u.phone as user_phone,
      u.profile_image as user_profile_image
    FROM books b
    LEFT JOIN users u ON b.user_id = u.id
    ORDER BY b.created_at DESC
  `);
  return result.rows;
}

// Obter livro por ID
async function getBookById(id) {
  const result = await pool.query(`
    SELECT 
      b.*,
      u.name as user_name,
      u.email as user_email,
      u.phone as user_phone,
      u.profile_image as user_profile_image,
      u.bio as user_bio
    FROM books b
    LEFT JOIN users u ON b.user_id = u.id
    WHERE b.id = $1
  `, [id]);
  return result.rows[0];
}

// Obter livros por usuário
async function getBooksByUserId(userId) {
  const result = await pool.query(`
    SELECT * FROM books 
    WHERE user_id = $1 
    ORDER BY created_at DESC
  `, [userId]);
  return result.rows;
}

// Criar novo livro
async function createBook(bookData) {
  const { 
    title, author, description, price, condition, 
    is_for_sale, is_for_exchange, cover_image, user_id,
    latitude, longitude, address 
  } = bookData;
  
  const result = await pool.query(
    `INSERT INTO books (
      title, author, description, price, condition, 
      is_for_sale, is_for_exchange, cover_image, user_id,
      latitude, longitude, address
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
    RETURNING *`,
    [
      title, author, description, price, condition,
      is_for_sale, is_for_exchange, cover_image, user_id,
      latitude, longitude, address
    ]
  );
  return result.rows[0];
}

// Atualizar livro
async function updateBook(id, bookData) {
  const { 
    title, author, description, price, condition, 
    is_for_sale, is_for_exchange, cover_image,
    latitude, longitude, address 
  } = bookData;
  
  const result = await pool.query(
    `UPDATE books 
     SET title = $1, author = $2, description = $3, price = $4, 
         condition = $5, is_for_sale = $6, is_for_exchange = $7, 
         cover_image = $8, latitude = $9, longitude = $10, address = $11,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $12 
     RETURNING *`,
    [
      title, author, description, price, condition,
      is_for_sale, is_for_exchange, cover_image,
      latitude, longitude, address, id
    ]
  );
  return result.rows[0];
}
// Atualizar livro
async function updateBook(id, bookData) {
  const { 
    title, author, description, price, condition, 
    is_for_sale, is_for_exchange, cover_image,
    latitude, longitude, address 
  } = bookData;
  
  const result = await pool.query(
    `UPDATE books 
     SET title = $1, author = $2, description = $3, price = $4, 
         condition = $5, is_for_sale = $6, is_for_exchange = $7, 
         cover_image = $8, latitude = $9, longitude = $10, address = $11,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $12 
     RETURNING *`,
    [
      title, author, description, price, condition,
      is_for_sale, is_for_exchange, cover_image,
      latitude, longitude, address, id
    ]
  );
  return result.rows[0];
}

// Deletar livro
async function deleteBook(id) {
  await pool.query('DELETE FROM books WHERE id = $1', [id]);
}

module.exports = {
  getAllBooks,
  getBookById,
  getBooksByUserId,
  createBook,
  updateBook,
  deleteBook
};

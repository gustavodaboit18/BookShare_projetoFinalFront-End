const pool = require('../config/database');

// Obter todos os usuários
async function getAllUsers() {
  const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
  return result.rows;
}

// Obter usuário por ID
async function getUserById(id) {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
}

// Obter usuário por email
async function getUserByEmail(email) {
  const result = await pool.query('SELECT id, name, email, password, phone, bio, profile_image, latitude, longitude, address FROM users WHERE email = $1', [email]);
  return result.rows[0];
}

// Criar novo usuário
async function createUser(userData) {
  const { name, email, password, phone, bio, profile_image, latitude, longitude, address } = userData;
  const result = await pool.query(
    `INSERT INTO users (name, email, password, phone, bio, profile_image, latitude, longitude, address) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
     RETURNING *`,
    [name, email, password, phone, bio, profile_image, latitude, longitude, address]
  );
  return result.rows[0];
}

// Atualizar usuário
async function updateUser(id, userData) {
  const { name, email, phone, bio, profile_image, latitude, longitude, address } = userData;
  const result = await pool.query(
    `UPDATE users 
     SET name = $1, email = $2, phone = $3, bio = $4, profile_image = $5, 
         latitude = $6, longitude = $7, address = $8, updated_at = CURRENT_TIMESTAMP
     WHERE id = $9 
     RETURNING *`,
    [name, email, phone, bio, profile_image, latitude, longitude, address, id]
  );
  return result.rows[0];
}

// Deletar usuário
async function deleteUser(id) {
  await pool.query('DELETE FROM users WHERE id = $1', [id]);
}

module.exports = {
  getAllUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser
};

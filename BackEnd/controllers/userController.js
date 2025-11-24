const userModel = require('../models/userModel');

// Listar todos os usuários
async function listUsers(req, res) {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ error: 'Erro ao listar usuários' });
  }
}

// Obter usuário por ID
async function getUser(req, res) {
  try {
    const { id } = req.params;
    const user = await userModel.getUserById(id);
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Erro ao obter usuário:', error);
    res.status(500).json({ error: 'Erro ao obter usuário' });
  }
}

// Criar novo usuário
async function createUser(req, res) {
  try {
    const userData = req.body;
    
    // Verificar se o email já existe
    const existingUser = await userModel.getUserByEmail(userData.email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }
    
    const newUser = await userModel.createUser(userData);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
}

// Atualizar usuário
async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const userData = req.body;
    
    const updatedUser = await userModel.updateUser(id, userData);
    
    if (!updatedUser) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
}

// Deletar usuário
async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    await userModel.deleteUser(id);
    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
}

module.exports = {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
};

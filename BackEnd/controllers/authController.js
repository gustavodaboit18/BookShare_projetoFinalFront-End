const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET;

// Registro
async function register(req, res) {
  try {
    const { name, email, password, phone, bio, profile_image, latitude, longitude, address } = req.body;

    // 1. Verificar se o usuário já existe
    const existingUser = await userModel.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // 2. Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Criar novo usuário
    const newUser = await userModel.createUser({
      name,
      email,
      password: hashedPassword, // Salva o hash da senha
      phone,
      bio,
      profile_image,
      latitude,
      longitude,
      address
    });

    // 4. Gerar Token JWT
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '1d' });

    // 5. Retornar token e dados do usuário (sem a senha)
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ token, user: userWithoutPassword });

  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
}

// Função de Login
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // 1. Buscar usuário por email
    const user = await userModel.getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ error: 'Email ou senha inválidos' });
    }

    // 2. Comparar senha
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Email ou senha inválidos' });
    }

    // 3. Gerar Token JWT
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });

    // 4. Retornar token e dados do usuário (sem a senha)
    const { password: _, ...userWithoutPassword } = user;
    res.json({ token, user: userWithoutPassword });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
}

module.exports = {
  register,
  login
};

import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Paper, Tabs, Tab, Alert } from '@mui/material';
import { useAuth } from '../hooks/useAuth.jsx';
import { useNavigate } from 'react-router-dom';

const AuthScreen = () => {
  const [tabValue, setTabValue] = useState(0);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    bio: '',
    profile_image: '',
    address: '',
  });
  const [error, setError] = useState(null);
  const { login: authLogin, register: authRegister } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
    setIsLogin(newValue === 0);
    setError(null);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (isLogin) {
        await authLogin(formData.email, formData.password);
        navigate('/books');
      } else {
        // Campos mínimos para registro
        if (!formData.name || !formData.email || !formData.password) {
          setError('Nome, Email e Senha são obrigatórios para o cadastro.');
          return;
        }
        await authRegister(formData);
        navigate('/books');
      }
    } catch (err) {
      setError(err.message || 'Ocorreu um erro. Tente novamente.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleChange} centered>
            <Tab label="Login" />
            <Tab label="Cadastrar" />
          </Tabs>
        </Box>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mt: 3, color: 'primary.main' }}>
          {isLogin ? 'Acessar BookShare' : 'Criar Conta'}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          {!isLogin && (
            <>
              <TextField
                label="Nome Completo"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Telefone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Endereço (Cidade/Estado)"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Biografia (Opcional)"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                multiline
                rows={2}
              />
            </>
          )}
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Senha"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            {isLogin ? 'Entrar' : 'Cadastrar'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AuthScreen;

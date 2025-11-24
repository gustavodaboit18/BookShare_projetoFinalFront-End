import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { Add as AddIcon, LocationOn as LocationIcon } from '@mui/icons-material';
import api from '../api.js';

// const API_URL = 'http://localhost:3000';

export default function AddBook() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    price: '',
    condition: 'Novo',
    is_for_sale: true,
    is_for_exchange: false,
    cover_image: '',
    address: '',
    latitude: null,
    longitude: null,
  });

  // Remove a lógica de carregar usuários, pois o user_id será o do usuário logado
  // useEffect(() => {
  //   fetchUsers();
  // }, []);

  // async function fetchUsers() {
  //   try {
  //     const response = await axios.get(`${API_URL}/users`);
  //     setUsers(response.data);
  //     if (response.data.length > 0) {
  //       setFormData(prev => ({ ...prev, user_id: response.data[0].id }));
  //     }
  //   } catch (err) {
  //     console.error('Erro ao carregar usuários:', err);
  //   }
  // }

  async function handleAddressSearch() {
    if (!formData.address.trim()) return;

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        formData.address
      )}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        setFormData(prev => ({
          ...prev,
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
        }));
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError('Endereço não encontrado');
        setTimeout(() => setError(''), 3000);
      }
    } catch (err) {
      setError('Erro ao buscar endereço');
      setTimeout(() => setError(''), 3000);
    }
  }

  function handleChange(e) {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!user) {
        setError('Você precisa estar logado para cadastrar um livro.');
        setLoading(false);
        return;
      }

      const bookData = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : null,
        user_id: user.id, 
      };

      await api.post('/books', bookData);
      
      setSuccess(true);
      setFormData({
        title: '',
        author: '',
        description: '',
        price: '',
        condition: 'Novo',
        is_for_sale: true,
        is_for_exchange: false,
        cover_image: '',
        address: '',
        latitude: null,
        longitude: null,
      });

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Erro ao cadastrar livro. Tente novamente.');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <img src="/logo.png" alt="BookShare" style={{ width: 50, height: 50, marginRight: 16 }} />
          <Typography variant="h4" component="h1" color="primary" fontWeight="bold">
            Cadastrar Livro
          </Typography>
        </Box>

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Livro cadastrado com sucesso!
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Informações básicas */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom color="primary">
                Informações do Livro
              </Typography>
            </Grid>

            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                required
                label="Título do Livro"
                name="title"
                value={formData.title}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                required
                label="Autor"
                name="author"
                value={formData.author}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Descrição"
                name="description"
                value={formData.description}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="URL da Capa"
                name="cover_image"
                value={formData.cover_image}
                onChange={handleChange}
                variant="outlined"
                placeholder="https://exemplo.com/capa.jpg"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Condição</InputLabel>
                <Select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  label="Condição"
                >
                  <MenuItem value="Novo">Novo</MenuItem>
                  <MenuItem value="Seminovo">Seminovo</MenuItem>
                  <MenuItem value="Usado">Usado</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Preço e tipo de transação */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom color="primary">
                Detalhes da Transação
              </Typography>
            </Grid>

            {formData.is_for_sale && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Preço (R$)"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  variant="outlined"
                  inputProps={{ step: '0.01', min: '0' }}
                  required={formData.is_for_sale}
                />
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                disabled
                label="Vendedor"
                value={user ? user.name : 'Faça login para cadastrar'}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.is_for_sale}
                    onChange={handleChange}
                    name="is_for_sale"
                    color="primary"
                  />
                }
                label="Disponível para venda"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.is_for_exchange}
                    onChange={handleChange}
                    name="is_for_exchange"
                    color="primary"
                  />
                }
                label="Disponível para troca"
              />
            </Grid>

            {/* Localização */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom color="primary">
                Localização
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Endereço"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  variant="outlined"
                  placeholder="Ex: São Paulo, SP"
                />
                <Button
                  variant="outlined"
                  onClick={handleAddressSearch}
                  startIcon={<LocationIcon />}
                  sx={{ minWidth: 150 }}
                >
                  Buscar
                </Button>
              </Box>
            </Grid>

            {formData.latitude && formData.longitude && (
              <Grid item xs={12}>
                <Alert severity="info">
                  Coordenadas: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
                </Alert>
              </Grid>
            )}

            {/* Botão de submit */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disabled={loading || !user}
                startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
                sx={{ mt: 2, py: 1.5 }}
              >
                {loading ? 'Cadastrando...' : 'Cadastrar Livro'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}

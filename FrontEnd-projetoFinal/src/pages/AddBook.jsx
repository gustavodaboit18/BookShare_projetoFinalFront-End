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
  InputAdornment,
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { 
  Add as AddIcon, 
  LocationOn as LocationIcon, 
  AttachMoney, 
  SwapHoriz,
  MenuBook,     // Ícone para Dados do Livro
  Handshake,    // Ícone para Negociação
  Map           // Ícone para Localização
} from '@mui/icons-material';
import api from '../api.js';

export default function AddBook({ bookToEdit, onFinish }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [addressSearchSuccess, setAddressSearchSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: bookToEdit?.title || '',
    author: bookToEdit?.author || '',
    description: bookToEdit?.description || '',
    price: bookToEdit?.price || '',
    condition: bookToEdit?.condition || 'Novo',
    is_for_sale: bookToEdit?.is_for_sale ?? true,
    is_for_exchange: bookToEdit?.is_for_exchange ?? false,
    cover_image: bookToEdit?.cover_image || '',
    address: bookToEdit?.address || '',
    latitude: bookToEdit?.latitude || null,
    longitude: bookToEdit?.longitude || null,
  });

  useEffect(() => {
    if (bookToEdit) {
      setFormData({
        title: bookToEdit.title,
        author: bookToEdit.author,
        description: bookToEdit.description,
        price: bookToEdit.price,
        condition: bookToEdit.condition,
        is_for_sale: bookToEdit.is_for_sale,
        is_for_exchange: bookToEdit.is_for_exchange,
        cover_image: bookToEdit.cover_image,
        address: bookToEdit.address,
        latitude: bookToEdit.latitude,
        longitude: bookToEdit.longitude,
      });
    }
  }, [bookToEdit]);

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
        setAddressSearchSuccess(true); 
        setTimeout(() => setAddressSearchSuccess(false), 3000);
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

      if (bookToEdit) {
        await api.put(`/books/${bookToEdit.id}`, bookData);
      } else {
        await api.post('/books', bookData);
      }

      setSuccess(true);
      if (onFinish) {
        onFinish();
      } else {
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
      }
    } catch (err) {
      setError('Erro ao cadastrar livro.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // --- ESTILOS ---
  const groupStyle = {
    p: 3,
    mb: 3,
    border: '1px solid',
    borderColor: 'divider',
    borderRadius: 3,
    backgroundColor: '#fff', 
    boxShadow: '0px 2px 4px rgba(0,0,0,0.02)'
  };

  const GroupTitle = ({ icon, text }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5, color: 'primary.main' }}>
        {icon}
        <Typography 
            variant="h6" 
            sx={{ 
                ml: 1, 
                fontWeight: 600, 
                fontSize: '1rem', 
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
            }}
        >
            {text}
        </Typography>
    </Box>
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, bgcolor: '#f5f5f5' }}>
        
        {/* Cabeçalho */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
            <img src="/logo.png" alt="Logo" style={{ width: 40, height: 40, marginRight: 12 }} />
            <Typography variant="h5" component="h1" fontWeight="bold" color="text.primary">
              {bookToEdit ? 'Editar Detalhes' : 'Novo Anúncio'}
            </Typography>
        </Box>

        {(success || error) && (
          <Box sx={{ mb: 3 }}>
            {success && <Alert severity="success" variant="filled">Salvo com sucesso!</Alert>}
            {error && <Alert severity="error" variant="filled">{error}</Alert>}
          </Box>
        )}

        <form onSubmit={handleSubmit}>
          
          {/* GRUPO 1: Dados Principais */}
          <Box sx={groupStyle}>
            <GroupTitle icon={<MenuBook />} text="Informações do Livro" />
            
            <Grid container spacing={2}>
              {/* Linha 1: Título e Autor */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth size="small"
                  label="Título da Obra" name="title"
                  value={formData.title} onChange={handleChange}
                  required variant="outlined" 
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth size="small"
                  label="Autor" name="author"
                  value={formData.author} onChange={handleChange}
                  required variant="outlined"
                />
              </Grid>
              
              {/* Linha 2: Condição e Capa */}
              <Grid item xs={12} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Condição</InputLabel>
                  <Select
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    label="Condição"
                    required variant="outlined"
                  >
                    <MenuItem value="Novo">Novo</MenuItem>
                    <MenuItem value="Seminovo">Seminovo</MenuItem>
                    <MenuItem value="Usado">Usado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth size="small"
                  label="Link da Imagem da Capa" name="cover_image"
                  value={formData.cover_image} onChange={handleChange}
                  placeholder="https://..."
                  required variant="outlined"
                />
              </Grid>

              {/* Linha 3: Descrição (Ocupa tudo embaixo) */}
              <Grid item xs={12}>
                <TextField
                  fullWidth 
                  multiline 
                  rows={1} // Reduzido para ficar mais discreto
                  size="small"
                  label="Descrição" name="description"
                  value={formData.description} onChange={handleChange}
                  required variant="outlined"
                />
              </Grid>
            </Grid>
          </Box>

          {/* GRUPO 2: Negociação */}
          <Box sx={groupStyle}>
            <GroupTitle icon={<Handshake />} text="Tipo de Negociação" />

            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', gap: 3 }}>
                    <FormControlLabel
                    control={
                        <Checkbox checked={formData.is_for_sale} onChange={handleChange} name="is_for_sale" />
                    }
                    label="Venda"
                    />
                    <FormControlLabel
                    control={
                        <Checkbox checked={formData.is_for_exchange} onChange={handleChange} name="is_for_exchange" />
                    }
                    label="Troca"
                    />
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                 <Box sx={{ visibility: formData.is_for_sale ? 'visible' : 'hidden' }}> 
                    <TextField
                        fullWidth size="small"
                        type="number"
                        label="Valor"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        variant="outlined"
                        required={formData.is_for_sale}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                        }}
                    />
                 </Box>
              </Grid>
            </Grid>
          </Box>

          {/* GRUPO 3: Localização */}
          <Box sx={groupStyle}>
            <GroupTitle icon={<Map />} text="Localização" />
            
            <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth size="small"
                  label="Endereço" name="address"
                  value={formData.address} onChange={handleChange}
                />
                <Button
                  variant="contained"
                  onClick={handleAddressSearch}
                  disableElevation
                  sx={{ minWidth: 100 }}
                >
                  <LocationIcon />
                </Button>
            </Box>
            
            {addressSearchSuccess && (
                <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'success.main', fontWeight: 'bold' }}>
                    ✓ Endereço validado
                </Typography>
            )}
          </Box>

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={loading || !user}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
            sx={{ py: 1.5, fontWeight: 'bold', fontSize: '1rem', borderRadius: 2 }}
          >
            {loading ? 'Processando...' : (bookToEdit ? 'Salvar Alterações' : 'Finalizar Cadastro')}
          </Button>
        
        </form>
      </Paper>
    </Container>
  );
}
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Avatar,
  Paper,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  ArrowBack as ArrowBackIcon,
  SwapHoriz as SwapIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

export default function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  async function fetchUserData() {
    try {
      const [userResponse, booksResponse] = await Promise.all([
        axios.get(`${API_URL}/users/${userId}`),
        axios.get(`${API_URL}/books/user/${userId}`),
      ]);

      setUser(userResponse.data);
      setBooks(booksResponse.data);
    } catch (err) {
      setError('Erro ao carregar perfil do usuário');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !user) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Usuário não encontrado'}</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/books')}
          sx={{ mt: 2 }}
        >
          Voltar
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/books')}
        sx={{ mb: 3 }}
        variant="outlined"
      >
        Voltar para Livros
      </Button>

      {/* Informações do perfil */}
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Avatar
              src={user.profile_image}
              alt={user.name}
              sx={{
                width: 200,
                height: 200,
                margin: '0 auto',
                mb: 2,
                border: '4px solid',
                borderColor: 'primary.main',
              }}
            />
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              {user.name}
            </Typography>
          </Grid>

          <Grid item xs={12} md={8}>
            <Typography variant="h5" color="primary" gutterBottom fontWeight="bold">
              Sobre
            </Typography>
            <Typography variant="body1" paragraph sx={{ mb: 3 }}>
              {user.bio || 'Este usuário ainda não adicionou uma biografia.'}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" color="primary" gutterBottom fontWeight="bold">
              Informações de Contato
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {user.email && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon color="primary" />
                  <Typography variant="body1">{user.email}</Typography>
                </Box>
              )}

              {user.phone && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhoneIcon color="primary" />
                  <Typography variant="body1">{user.phone}</Typography>
                </Box>
              )}

              {user.address && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationIcon color="primary" />
                  <Typography variant="body1">{user.address}</Typography>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Livros do vendedor */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h2" color="primary" fontWeight="bold" gutterBottom>
          Livros para Venda/Troca
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {books.length} {books.length === 1 ? 'livro disponível' : 'livros disponíveis'}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {books.map(book => (
          <Grid item xs={12} sm={6} md={4} key={book.id}>
            <Card
              elevation={3}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
            >
              {book.cover_image && (
                <CardMedia
                  component="img"
                  height="280"
                  image={book.cover_image}
                  alt={book.title}
                  sx={{ objectFit: 'cover' }}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
                  {book.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  por {book.author}
                </Typography>

                {book.description && (
                  <Typography variant="body2" sx={{ mt: 1, mb: 2 }} color="text.secondary">
                    {book.description.length > 100
                      ? `${book.description.substring(0, 100)}...`
                      : book.description}
                  </Typography>
                )}

                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip label={book.condition} size="small" color="primary" variant="outlined" />
                  {book.is_for_sale && (
                    <Chip
                      icon={<MoneyIcon />}
                      label="Venda"
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                  )}
                  {book.is_for_exchange && (
                    <Chip
                      icon={<SwapIcon />}
                      label="Troca"
                      size="small"
                      color="info"
                      variant="outlined"
                    />
                  )}
                </Box>

                {book.price && (
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    R$ {parseFloat(book.price).toFixed(2)}
                  </Typography>
                )}

                {book.address && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 2 }}>
                    <LocationIcon fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary">
                      {book.address}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {books.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            Este vendedor ainda não possui livros cadastrados.
          </Typography>
        </Box>
      )}
    </Container>
  );
}

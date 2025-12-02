import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Grid, Avatar, Chip, Button, CircularProgress, Alert, Modal } from '@mui/material';
import { Phone as PhoneIcon, Email as EmailIcon, LocationOn as LocationIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth.jsx';
import api from '../api.js';
import BookCard from '../components/BookCard.jsx';
import AddBook from './AddBook.jsx'; // Reutilizar o formulário de cadastro para edição

export default function MyProfile() {
  const { user, loading: authLoading } = useAuth();
  const [userBooks, setUserBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookToEdit, setBookToEdit] = useState(null);

  const fetchUserBooks = async (userId) => {
    try {
      setLoading(true);
      const response = await api.get(`/books/user/${userId}`);
      setUserBooks(response.data);
    } catch (err) {
      setError('Erro ao carregar seus livros.');
      console.error('Erro ao carregar livros do usuário:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (book) => {
    setBookToEdit(book);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setBookToEdit(null);
    fetchUserBooks(user.id); // Recarrega a lista após fechar o modal (se houve edição)
  };

  useEffect(() => {
    if (user && user.id) {
      fetchUserBooks(user.id);
    } else if (!authLoading && !user) {
      setError('Você precisa estar logado para ver seu perfil.');
      setLoading(false);
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="warning">Por favor, faça login para acessar seu perfil.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom color="primary" fontWeight="bold">
        Meu Perfil
      </Typography>

      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={3} sx={{ textAlign: 'center' }}>
            <Avatar
              src={user.profile_image || '/default-avatar.png'}
              alt={user.name}
              sx={{ width: 120, height: 120, margin: '0 auto', mb: 2 }}
            />
            <Typography variant="h5" fontWeight="bold">
              {user.name}
            </Typography>
          </Grid>

          <Grid item xs={12} md={9}>
            <Typography variant="h6" color="primary" gutterBottom>
              Sobre Mim
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {user.bio || 'Nenhuma biografia fornecida.'}
            </Typography>

            <Typography variant="h6" color="primary" gutterBottom>
              Contato e Localização
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Chip icon={<EmailIcon />} label={user.email} variant="outlined" />
              {user.phone && <Chip icon={<PhoneIcon />} label={user.phone} variant="outlined" />}
              {user.address && <Chip icon={<LocationIcon />} label={user.address} variant="outlined" />}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h4" component="h2" gutterBottom color="primary" fontWeight="bold" sx={{ mt: 4 }}>
        Meus Livros Cadastrados ({userBooks.length})
      </Typography>

      {userBooks.length === 0 && (
        <Alert severity="info">Você ainda não cadastrou nenhum livro.</Alert>
      )}

      <Grid container spacing={4}>
        {userBooks.map((book) => (
          <Grid item key={book.id} xs={12} sm={6} md={4} lg={3} sx={{ display: 'flex' }}>
            <BookCard 
              book={book} 
              showDeleteButton={true} 
              onDelete={() => fetchUserBooks(user.id)} 
              showEditButton={true}
              onEdit={handleEdit}
            />
          </Grid>
        ))}
      </Grid>

      {/* Modal de Edição */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', md: '70%' },
          maxHeight: '90vh',
          overflowY: 'auto',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}>
          <Typography variant="h5" component="h2" gutterBottom color="primary" fontWeight="bold">
            {bookToEdit ? 'Editar Livro' : 'Cadastrar Livro'}
          </Typography>
          <AddBook bookToEdit={bookToEdit} onFinish={handleCloseModal} />
        </Box>
      </Modal>
    </Container>
  );
}
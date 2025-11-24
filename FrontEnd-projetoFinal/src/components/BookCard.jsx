import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Button,
  Avatar,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  SwapHoriz as SwapIcon,
  AttachMoney as MoneyIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import api from '../api.js';

const FixedHeightCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[6],
  },
}));

const TruncatedText = styled(Typography)({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 3, // Limita a 3 linhas
  WebkitBoxOrient: 'vertical',
  minHeight: '4.5em', // Altura mínima para 3 linhas de texto
});

export default function BookCard({ book, showDeleteButton = false, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const handleViewProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handleDelete = async () => {
    if (window.confirm(`Tem certeza que deseja excluir o livro "${book.title}"?`)) {
      setIsDeleting(true);
      try {
        await api.delete(`/books/${book.id}`);
        if (onDelete) {
          onDelete(book.user_id); // Chama a função de callback para atualizar a lista
        }
      } catch (error) {
        console.error('Erro ao excluir livro:', error);
        alert('Erro ao excluir livro. Tente novamente.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <FixedHeightCard elevation={3}>
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
        <Typography variant="h6" component="h2" gutterBottom fontWeight="bold">
          {book.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          por {book.author}
        </Typography>

        {book.description && (
          <TruncatedText variant="body2" sx={{ mt: 1, mb: 2 }} color="text.secondary">
            {book.description}
          </TruncatedText>
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
          <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom>
            R$ {parseFloat(book.price).toFixed(2)}
          </Typography>
        )}

        {book.address && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
            <LocationIcon fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary">
              {book.address}
            </Typography>
          </Box>
        )}

        {/* Informações do vendedor */}
        <Box
          sx={{
            mt: 'auto', // Empurra para o final do CardContent
            pt: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Avatar
              src={book.user_profile_image}
              alt={book.user_name}
              sx={{ width: 32, height: 32 }}
            />
            <Typography variant="body2" fontWeight="bold">
              {book.user_name}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
            {book.user_phone && (
              <Chip
                icon={<PhoneIcon />}
                label={book.user_phone}
                size="small"
                variant="outlined"
              />
            )}
          </Box>

          {book.user_email && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
              <EmailIcon fontSize="small" color="action" />
              <Typography variant="caption" color="text.secondary">
                {book.user_email}
              </Typography>
            </Box>
          )}

          {showDeleteButton ? (
            <Button
              fullWidth
              variant="contained"
              color="error"
              startIcon={isDeleting ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
              onClick={handleDelete}
              disabled={isDeleting}
              sx={{ mt: 1 }}
            >
              {isDeleting ? 'Excluindo...' : 'Excluir Livro'}
            </Button>
          ) : (
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              startIcon={<PersonIcon />}
              onClick={() => handleViewProfile(book.user_id)}
              sx={{ mt: 1 }}
            >
              Ver Perfil do Vendedor
            </Button>
          )}
        </Box>
      </CardContent>
    </FixedHeightCard>
  );
}

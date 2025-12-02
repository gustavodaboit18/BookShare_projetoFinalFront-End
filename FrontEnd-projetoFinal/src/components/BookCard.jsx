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
  Tooltip,
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
  MenuBook as BookIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import api from '../api.js';


const FixedHeightCard = styled(Card)(({ theme }) => ({
  minHeight: 520,      // altura mínima padrão
  height: "100%",      // ajustar ao container
  display: "flex",
  width: "100%",
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
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  minHeight: '4.5em',
  wordBreak: 'break-word',
});

const TruncatedTitle = styled(Typography)({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  minHeight: '2.6em',
  lineHeight: '1.3em',
  fontWeight: 'bold',
});


export default function BookCard({ book, showDeleteButton = false, showEditButton = false, onDelete, onEdit, style, sx }) { 
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const handleViewProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Tem certeza que deseja excluir o livro "${book.title}"?`)) return;

    setIsDeleting(true);

    try {
      await api.delete(`/books/${book.id}`);

      if (onDelete) {
        onDelete(book.user_id);
      }
    } catch (error) {
      console.error('Erro ao excluir livro:', error);
      alert('Erro ao excluir livro. Tente novamente.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    
    <FixedHeightCard elevation={3} style={style} sx={sx}>

      {/* IMAGEM */}
      {book.cover_image ? (
        <CardMedia
          component="img"
          height="280"
          image={book.cover_image}
          alt={book.title}
          sx={{ objectFit: 'cover' }}
        />
      ) : (
        <Box
          sx={{
            height: 280,
            bgcolor: 'grey.200',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'grey.500',
          }}
        >
          <BookIcon sx={{ fontSize: 60 }} />
        </Box>
      )}

      {/* CONTEÚDO */}      
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>

        {/* TÍTULO */}
        <TruncatedTitle variant="h6" component="h2" gutterBottom>
          {book.title}
        </TruncatedTitle>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          por {book.author}
        </Typography>

        {/* DESCRIÇÃO - Altura Fixa (3 linhas) */}
        <TruncatedText variant="body2" sx={{ mt: 1, mb: 2 }} color="text.secondary">
          {book.description || "Sem descrição disponível."}
        </TruncatedText>

        {/* CHIPS */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip label={book.condition} size="small" color="primary" variant="outlined" />
          {book.is_for_sale && (
            <Chip icon={<MoneyIcon />} label="Venda" size="small" color="success" variant="outlined" />
          )}
          {book.is_for_exchange && (
            <Chip icon={<SwapIcon />} label="Troca" size="small" color="info" variant="outlined" />
          )}
        </Box>

        {/* PREÇO - Garantindo Espaço Consistente */}
        <Box sx={{ minHeight: '1.5em', mb: 1 }}>
            {book.price && (
                <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom>
                    R$ {parseFloat(book.price).toFixed(2)}
                </Typography>
            )}
        </Box>

        {/* ENDEREÇO */}
        {book.address && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
            <LocationIcon fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary">
              {book.address}
            </Typography>
          </Box>
        )}

        {/* RODAPÉ */}
        <Box
          sx={{
            mt: 'auto', // Empurra para o final do CardContent
            pt: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >

          {/* VENDEDOR */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Avatar src={book.user_profile_image} alt={book.user_name} sx={{ width: 32, height: 32 }} />
            <Typography variant="body2" fontWeight="bold">
              {book.user_name}
            </Typography>
          </Box>

          {/* TELEFONE */}
          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
            {book.user_phone && (
              <Chip icon={<PhoneIcon />} label={book.user_phone} size="small" variant="outlined" />
            )}
          </Box>

          {/* EMAIL */}
          {book.user_email && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
              <EmailIcon fontSize="small" color="action" />
              <Typography variant="caption" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                {book.user_email}
              </Typography>
            </Box>
          )}

          {/* BOTÕES FINAIS */}
          {showDeleteButton || showEditButton ? (
	            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
	              {showEditButton && (
	                <Button
	                  fullWidth
	                  variant="outlined"
	                  color="primary"
	                  startIcon={<EditIcon />}
	                  onClick={() => onEdit(book)}
	                  sx={{ flex: 1 }}
	                >
	                  Editar
	                </Button>
	              )}
	              {showDeleteButton && (
	                <Button
	                  fullWidth
	                  variant="contained"
	                  color="error"
	                  startIcon={isDeleting ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
	                  onClick={handleDelete}
	                  disabled={isDeleting}
	                  sx={{ flex: 1 }}
	                >
	                  {isDeleting ? 'Excluindo...' : 'Excluir'}
	                </Button>
	              )}
	            </Box>
	          ) : (

            <>
              {/* Botão Ver Perfil */}
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

              {/* Botão Comprar */}
              {book.is_for_sale ? (
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  sx={{ mt: 1 }}
                  onClick={() => navigate(`/payments/${book.id}`)}
                >
                  Comprar
                </Button>
              ) : (
                <Tooltip title="Este livro é apenas para troca">
                  <span>
                    <Button
                      fullWidth
                      variant="contained"
                      color="success"
                      sx={{ mt: 1 }}
                      disabled
                    >
                      Comprar
                    </Button>
                  </span>
                </Tooltip>
              )}
            </>
          )}
        </Box>
      </CardContent>
    </FixedHeightCard>
  );
}
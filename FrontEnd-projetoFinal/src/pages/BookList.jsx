import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";

import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  SwapHoriz as SwapIcon,
  AttachMoney as MoneyIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

import BookCard from '../components/BookCard.jsx';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const API_URL = 'http://localhost:3000';



export default function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  async function fetchBooks() {
    try {
      const response = await axios.get(`${API_URL}/books`);
      setBooks(response.data);
    } catch (err) {
      setError('Erro ao carregar livros');
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

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container 
      maxWidth="xl"
      disableGutters
      sx={{ py: 4 }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <img src="/logo.png" alt="BookShare" style={{ width: 60, height: 60, marginRight: 16 }} />
        <Typography variant="h3" component="h1" color="primary" fontWeight="bold">
          Livros Disponíveis
        </Typography>
      </Box>

      {/* Lista de livros */}
      <Grid
        container
        rowSpacing={3}
        columnSpacing={3}
        justifyContent="center"
        sx={{ px: 2 }}
      >
        {books.map(book => (
          <Grid item xs={12} sm={4} md={4} lg={4}>
            <BookCard book={book} />
          </Grid>
        ))}
      </Grid>

      {books.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            Nenhum livro cadastrado ainda.
          </Typography>
        </Box>
      )}

      {/* Mapa movido para o final */}
      <Typography variant="h5" component="h2" color="primary" fontWeight="bold" sx={{ mt: 6, mb: 2 }}>
        Localização dos Livros
      </Typography>
      <Paper elevation={3} sx={{ mb: 4, overflow: 'hidden', borderRadius: 2 }}>
        <Box sx={{ height: 400, position: 'relative' }}>
          <MapContainer
            center={[-15.7797, -47.9297]}
            zoom={4}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {books
              .filter(book => book.latitude && book.longitude)
              .map(book => (
                <Marker
                  key={book.id}
                  position={[book.latitude, book.longitude]}
                  eventHandlers={{
                    click: () => setSelectedBook(book),
                  }}
                >
                  <Popup>
                    <Box sx={{ minWidth: 200 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {book.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {book.author}
                      </Typography>
                      {book.price && (
                        <Typography variant="body2" color="primary" fontWeight="bold">
                          R$ {parseFloat(book.price).toFixed(2)}
                        </Typography>
                      )}
                      <Typography variant="caption" display="block">
                        {book.address}
                      </Typography>
                    </Box>
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
        </Box>
      </Paper>
    </Container>
  );
}

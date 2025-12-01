import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppBar, Toolbar, Button, Box, Container } from '@mui/material';
import { Add as AddIcon, List as ListIcon } from '@mui/icons-material';
import theme from './theme';
import AddBook from './pages/AddBook';
import BookList from './pages/BookList';
import UserProfile from './pages/UserProfile';
import MyProfile from './pages/MyProfile';
import AuthScreen from './pages/AuthScreen';
import { AuthProvider, useAuth } from './hooks/useAuth.jsx';
import PaymentPage from "./pages/Payment.jsx";

function Navigation() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <AppBar position="sticky" elevation={2}>
      <Container maxWidth="xl">
        <Toolbar sx={{ gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <img src="/logo.png" alt="BookShare" style={{ width: 40, height: 40, marginRight: 12 }} />
            <Box
              component="span"
              sx={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'white',
              }}
            >
              BookShare
            </Box>
          </Box>

          <Button
            color="inherit"
            component={Link}
            to="/books"
            startIcon={<ListIcon />}
            variant={location.pathname === '/books' ? 'outlined' : 'text'}
            sx={{
              borderColor: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Livros
          </Button>

          {user && (
            <Button
              color="inherit"
              component={Link}
              to="/add-book"
              startIcon={<AddIcon />}
              variant={location.pathname === '/add-book' ? 'outlined' : 'text'}
              sx={{
                borderColor: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Cadastrar Livro
            </Button>
          )}

          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                color="inherit"
                component={Link}
                to="/my-profile"
                variant={location.pathname === '/my-profile' ? 'outlined' : 'text'}
                sx={{
                  borderColor: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  mr: 1,
                }}
              >
                Meu Perfil
              </Button>
              <Button
                color="inherit"
                onClick={logout}
                variant="outlined"
                sx={{
                  borderColor: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Sair ({user.name.split(' ')[0]})
              </Button>
            </Box>
          ) : (
            <Button
              color="inherit"
              component={Link}
              to="/auth"
              variant={location.pathname === '/auth' ? 'outlined' : 'text'}
              sx={{
                borderColor: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Login/Cadastro
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Carregando...</Box>;
  return user ? children : <Navigate to="/auth" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<BookList />} />
      <Route path="/books" element={<BookList />} />
      <Route path="/auth" element={<AuthScreen />} />
      <Route path="/add-book" element={<PrivateRoute><AddBook /></PrivateRoute>} />
      <Route path="/profile/:userId" element={<UserProfile />} />
      <Route path="/my-profile" element={<PrivateRoute><MyProfile /></PrivateRoute>} />
      <Route path="/payments/:bookId" element={<PaymentPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Navigation />
          <AppRoutes />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

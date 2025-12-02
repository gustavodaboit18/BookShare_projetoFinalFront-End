import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Card, CardContent, Divider, Button, Modal, Container } from "@mui/material";
import { QRCodeSVG } from "qrcode.react";
import api from "../api.js";
import { CircularProgress } from "@mui/material";

const PixLoading = ({ message }) => (
  <Box 
    sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '80vh', 
      textAlign: 'center' 
    }}
  >
    <CircularProgress color="primary" size={60} sx={{ mb: 3 }} />
    <Typography variant="h5" fontWeight="bold" color="text.primary" sx={{ mb: 1 }}>
      Processando Pagamento...
    </Typography>
    <Typography variant="subtitle1" color="text.secondary">
      {message}
    </Typography>
  </Box>
);

export default function PaymentPage() {
  const navigate = useNavigate();
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [qrCode, setQrCode] = useState("");
  const [qrCodeBase64, setQrCodeBase64] = useState("");
  const [ticketUrl, setTicketUrl] = useState("");
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [mpPaymentId, setMpPaymentId] = useState(null);

  // Busca os detalhes do livro
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await api.get(`/books/${bookId}`);
        setBook(res.data);
      } catch (err) {
        console.error("Erro ao buscar livro:", err);
      }
    };
    fetchBook();
  }, [bookId]);

  // Gera pagamento PIX
  useEffect(() => {
    if (!book || !book.price || isNaN(book.price) || book.price <= 0) return;
    if (mpPaymentId) return;

    const generatePix = async () => {
      try {
        const res = await api.post("/payments/pix", {
          bookId: book.id,
          title: book.title,
          price: book.price,
        });
        console.log("ID do pagamento Mercado Pago:", res.data.mpPaymentId);

        setQrCode(res.data.qr_code);
        setQrCodeBase64(res.data.qr_code_base64);
        setTicketUrl(res.data.ticket_url);

        // Guarda o id do pagamento para polling
        setMpPaymentId(res.data.mpPaymentId);

      } catch (err) {
        console.error("Erro ao gerar pagamento PIX", err);
      }
    };

    generatePix();
  }, [book, mpPaymentId]);

  // Polling para verificar status do pagamento
  useEffect(() => {
    if (!mpPaymentId) return;

    const intervalId = setInterval(async () => {
      try {
        const res = await api.get(`/payments/status/${mpPaymentId}`);
        if (res.data.status === "approved") {
          setPaymentConfirmed(true);
          clearInterval(intervalId);
        }
      } catch (err) {
        console.error("Erro ao verificar status do pagamento:", err);
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [mpPaymentId]);

  // Renderizar loading enquanto livro ou QRCode não estiverem disponíveis
  if (!book) {
    return <PixLoading message="Buscando detalhes do livro e valor da compra." />;
  }
  if (!qrCode) {
    return <PixLoading message="Comunicando com a API do PIX para gerar o QR Code. Isso pode levar alguns segundos." />;
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Card sx={{ width: "100%", p: 2, boxShadow: 3, borderRadius: 2 }}>
        <CardContent sx={{ textAlign: "center" }}>
          <Typography variant="h4" component="h1" color="primary" fontWeight="bold" gutterBottom>
	            Confirme seu pagamento
	          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h5" sx={{ mt: 2, fontWeight: 'bold' }}>Livro: {book?.title}</Typography>
          {book?.author && <Typography variant="subtitle1" color="text.secondary">Autor: {book.author}</Typography>}
          <Typography variant="h3" color="success.main" fontWeight="bold" sx={{ mt: 1 }}>R$ {Number(book?.price ?? 0).toFixed(2)}</Typography>
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Forma de pagamento: <Box component="span" fontWeight="bold" color="primary.main">PIX</Box></Typography>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <QRCodeSVG value={qrCode} size={250} />
          </Box>

          {qrCodeBase64 && (
            <img
              src={`data:image/png;base64,${qrCodeBase64}`}
              alt="QR Code PIX"
              style={{ display: "none" }}
            />
          )}

          {ticketUrl && (
              <Button
	              variant="contained"
	              color="primary"
	              size="large"
	              sx={{ mt: 2, py: 1.5 }}
	              href={ticketUrl}
	              target="_blank"
	              fullWidth
	            >
	              Abrir pagamento no navegador
	            </Button>
          )}
        </CardContent>
      </Card>

      {/* Modal de pagamento confirmado */}
      <Modal
        open={paymentConfirmed}
        onClose={() => {}}
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
          textAlign: 'center'
        }}>

          <Typography variant="h6" gutterBottom>
            Pagamento confirmado!
          </Typography>

          <Typography sx={{ mb: 3 }}>
            Obrigado por comprar o livro {book?.title}.
          </Typography>

          <Button
            variant="contained"
            color="success"
            sx={{ mb: 2 }}
            href={`http://localhost:3000/payments/comprovante/${mpPaymentId}`}
            target="_blank"
          >
            Gerar Comprovante PDF
          </Button>

          <br />

          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate("/books")}
          >
            Fechar
          </Button>

        </Box>
      </Modal>
      
      </Container>
	  );
	}

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Card, CardContent, Divider, Button, Modal } from "@mui/material";
import { QRCodeSVG } from "qrcode.react";
import api from "../api.js";


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
  if (!book) return <Typography>Carregando livro...</Typography>;
  if (!qrCode) return <Typography>Gerando pagamento PIX...</Typography>;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 4, px: 2 }}>
      <Card sx={{ maxWidth: 400, width: "100%", p: 2, boxShadow: 3 }}>
        <CardContent sx={{ textAlign: "center" }}>
          <Typography variant="h6" gutterBottom>
            Confirme seu pagamento
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1"><strong>Livro:</strong> {book?.title}</Typography>
          {book?.author && <Typography variant="subtitle2"><strong>Autor:</strong> {book.author}</Typography>}
          <Typography variant="subtitle1"><strong>Preço:</strong> R$ {Number(book?.price ?? 0).toFixed(2)}</Typography>
          <Typography variant="subtitle1" sx={{ mt: 1 }}><strong>Forma de pagamento:</strong> PIX</Typography>

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
              sx={{ mt: 2 }}
              href={ticketUrl}
              target="_blank"
            >
              Abrir pagamento no navegador
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Modal de pagamento confirmado */}
      <Modal
        open={paymentConfirmed}
        onClose={() => {
          setPaymentConfirmed(false);
          navigate("/books"); // redireciona para a lista de livros
        }}
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
          <Typography sx={{ mb: 2 }}>
            Obrigado por comprar o livro {book?.title}.
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              setPaymentConfirmed(false);
              navigate("/books"); 
            }}
          >
            Fechar
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}

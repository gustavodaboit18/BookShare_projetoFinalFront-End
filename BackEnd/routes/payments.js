const express = require("express");
const router = express.Router();
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

// Criar pagamento PIX
router.post("/pix", async (req, res) => {
  const { bookId, title, price } = req.body;

  const transactionAmount = parseFloat(price);
  if (!price || isNaN(transactionAmount) || transactionAmount <= 0) {
    return res.status(400).json({ error: "'price' inválido ou nulo." });
  }

  try {
    const paymentData = {
      transaction_amount: transactionAmount,
      description: title,
      payment_method_id: "pix",
      payer: { email: "teste@cliente.com" },
    };

    const response = await axios.post(
      "https://api.mercadopago.com/v1/payments",
      paymentData,
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
          "X-Idempotency-Key": uuidv4(),
        },
      }
    );

    const payment = response.data;

    // Retorna info para o frontend
    return res.json({
      mpPaymentId: payment.id,
      qr_code: payment.point_of_interaction.transaction_data.qr_code,
      qr_code_base64: payment.point_of_interaction.transaction_data.qr_code_base64,
    });
  } catch (err) {
    const apiError = err.response ? err.response.data : { message: err.message };
    console.error("Erro ao criar pagamento PIX:", apiError);
    return res.status(err.response ? err.response.status : 500).json({
      error: "Erro na criação do pagamento PIX",
      details: apiError,
    });
  }
});

// Rota para verificar status do pagamento pelo Mercado Pago
router.get("/status/:mpPaymentId", async (req, res) => {
  const { mpPaymentId } = req.params;

  try {
    const response = await axios.get(
      `https://api.mercadopago.com/v1/payments/${mpPaymentId}`,
      {
        headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
      }
    );

    res.json({ status: response.data.status });
  } catch (err) {
    console.error("Erro ao consultar status no MP:", err);
    res.status(500).json({ error: "Erro ao consultar status do pagamento" });
  }
});

module.exports = router;

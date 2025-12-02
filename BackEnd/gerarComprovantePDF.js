const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

function gerarComprovantePDF(dados) {
  const { paymentId, title, price, buyer, date } = dados;

  // Cria pasta comprovantes se não existir
  const folderPath = path.join(__dirname, "../BackEnd/comprovantes");
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  const filePath = path.join(folderPath, `comprovante_${paymentId}.pdf`);

  const doc = new PDFDocument();
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  doc.fontSize(22).text("COMPROVANTE DE COMPRA - BOOKSHARE", { align: "center" });
  doc.moveDown();

  doc.fontSize(14).text(`ID do Pagamento: ${paymentId}`);
  doc.text(`Livro: ${title}`);
  doc.text(`Valor: R$ ${Number(price).toFixed(2)}`);
  doc.text(`Comprador: ${buyer}`);
  doc.text(`Data: ${date}`);

  doc.moveDown();
  doc.text("Obrigado por usar o BookShare!", { align: "center" });

  doc.end();

  return filePath;
}

module.exports = gerarComprovantePDF;

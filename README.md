🚀 Guia Resumido de Instalação do Projeto BookShareEste é um resumo dos passos de instalação e configuração do seu projeto, dividido nas partes Backend (Node.js) e Frontend (React/Material UI).1. ⚙️ Instalação e Configuração GeralPré-requisitos: Certifique-se de ter Node.js e npm instalados.Instalação de Dependências:Backend (API): Navegue até a pasta da API e execute:Bashnpm install
Frontend (React): Navegue até a pasta do cliente e execute:Bashnpm install
Variáveis de Ambiente: Crie um arquivo .env na raiz do seu Backend e adicione:BashPORT=3000
API_URL=http://localhost:3000

# Chave Privada do Mercado Pago
MP_ACCESS_TOKEN="SUA_CHAVE_DE_ACESSO_PRIVADA_AQUI"
2. 🔌 Dependências ChaveCertifique-se de que as seguintes bibliotecas estão presentes:AmbienteBibliotecaFunção PrincipalBackendexpressServidor e rotas da API.BackendaxiosCliente HTTP para chamar a API do Mercado Pago (solução para o SDK com erro).Frontend@mui/materialComponentes visuais (Material UI).Frontendreact-leaflet, leafletMapas de localização.FrontendaxiosComunicação com o Backend.3. ▶️ Como IniciarAmbienteComandoAcesso (Geralmente)Backendnpm start (ou node server.js)http://localhost:3000Frontendnpm start (ou npm run dev)http://localhost:PORTA_DO_REACTNota: O Frontend deve estar configurado para se comunicar com a URL do Backend (http://localhost:3000).
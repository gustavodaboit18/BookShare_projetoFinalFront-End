# 📚 BookShare - Clube de Troca de Livros

Este projeto é uma plataforma para troca e venda de livros, conectando leitores através de mapas interativos

🚀 Guia Resumido de Instalação do Projeto BookShare. Este é um resumo dos passos de instalação e configuração do seu projeto, dividido nas partes de Backend (Node.js) e Frontend (React/Material UI). 

⚙️ Instalação e Configuração Geral: pré-requisitos: certifique-se de ter Node.js e npm instalados. 
npm install nodemon
npm install express
Instalação de Dependências: Backend (API): Navegue até a pasta da API e execute: Bash npm install. Frontend (React): Navegue até a pasta do cliente e execute:Bash npm install.
Variáveis de Ambiente: Crie um arquivo .env na raiz do seu Backend e adicione:Bash PORT=3000 API_URL=http://localhost:3000

# Chave Privada do Mercado Pago
MP_ACCESS_TOKEN="SUA_CHAVE_DE_ACESSO_PRIVADA_AQUI"2.  
🔌 Dependências Chave: certifique-se de que as seguintes bibliotecas estão presentes: 
Ambiente | Biblioteca | Função Principal |  
| Backend | 'express' | Servidor e rotas da API. |  
| Backend | 'axios' | Cliente HTTP para chamar a API do Mercado Pago (solução para o SDK com erro). |  
| Frontend | '@mui/material' | Componentes visuais (Material UI). |  
| Frontend | 'react-leaflet', 'leaflet' | Mapas de localização. |  
| Frontend | 'axios' |Comunicação com o Backend.| 3.   
▶️ Como Iniciar: 
| Ambiente | Comando | Acesso | Backend npm start (ou node server.js) | http://localhost:3000. |  
Frontend npm start (ou npm run dev) http://localhost:PORTA_DO_REACT
Nota: O Frontend deve estar configurado para se comunicar com a URL do Backend (http://localhost:3000).

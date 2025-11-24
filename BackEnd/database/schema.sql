-- Criação das tabelas do sistema BookShare

-- Tabela de usuários/vendedores
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    bio TEXT,
    profile_image VARCHAR(500),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de livros
CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    condition VARCHAR(50),
    is_for_sale BOOLEAN DEFAULT true,
    is_for_exchange BOOLEAN DEFAULT false,
    cover_image VARCHAR(500),
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_books_user_id ON books(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Inserir usuários de exemplo
INSERT INTO users (name, email, password, phone, bio, profile_image, latitude, longitude, address) VALUES
('João Silva', 'joao@email.com', '$2a$10$f.1tC.E.s.1/2q.3u.4v.5w.6x.7y.8z.9A.B.C.D.E.F', '(11) 98765-4321', 'Apaixonado por livros de ficção científica e fantasia. Sempre em busca de novas histórias para trocar e compartilhar.', 'https://i.pravatar.cc/300?img=12', -23.5505, -46.6333, 'São Paulo, SP'),
('Maria Santos', 'maria@email.com', '$2a$10$f.1tC.E.s.1/2q.3u.4v.5w.6x.7y.8z.9A.B.C.D.E.F', '(21) 99876-5432', 'Professora de literatura com uma vasta coleção de clássicos. Adoro conhecer novos leitores e trocar experiências.', 'https://i.pravatar.cc/300?img=45', -22.9068, -43.1729, 'Rio de Janeiro, RJ'),
('Pedro Costa', 'pedro@email.com', '$2a$10$f.1tC.E.s.1/2q.3u.4v.5w.6x.7y.8z.9A.B.C.D.E.F', '(31) 97654-3210', 'Colecionador de livros técnicos e de programação. Sempre disposto a ajudar quem está começando na área.', 'https://i.pravatar.cc/300?img=33', -19.9167, -43.9345, 'Belo Horizonte, MG');

-- Inserir livros de exemplo
INSERT INTO books (title, author, description, price, condition, is_for_sale, is_for_exchange, cover_image, user_id, latitude, longitude, address) VALUES
('1984', 'George Orwell', 'Clássico da literatura distópica que retrata um futuro totalitário.', 35.00, 'Novo', true, true, 'https://m.media-amazon.com/images/I/61NAx5pd6XL._SY466_.jpg', 1, -23.5505, -46.6333, 'São Paulo, SP'),
('O Senhor dos Anéis', 'J.R.R. Tolkien', 'Trilogia completa em capa dura. Estado de conservação excelente.', 120.00, 'Seminovo', true, false, 'https://br.web.img3.acsta.net/medias/nmedia/18/92/91/32/20224832.jpg', 1, -23.5505, -46.6333, 'São Paulo, SP'),
('Dom Casmurro', 'Machado de Assis', 'Obra-prima da literatura brasileira. Edição comentada.', 25.00, 'Usado', true, true, 'https://bibliotecamundial.com.br/wp-content/uploads/2024/05/dom-casmurro-machado-de-assis.webp', 2, -22.9068, -43.1729, 'Rio de Janeiro, RJ'),
('Clean Code', 'Robert C. Martin', 'Guia essencial para escrever código limpo e manutenível.', 80.00, 'Novo', true, false, 'https://m.media-amazon.com/images/I/51E2055ZGUL._SY466_.jpg', 3, -19.9167, -43.9345, 'Belo Horizonte, MG'),
('Harry Potter e a Pedra Filosofal', 'J.K. Rowling', 'Primeiro livro da série. Perfeito para iniciar a coleção.', 30.00, 'Seminovo', true, true, 'https://m.media-amazon.com/images/I/81ibfYk4qmL._SY466_.jpg', 2, -22.9068, -43.1729, 'Rio de Janeiro, RJ');

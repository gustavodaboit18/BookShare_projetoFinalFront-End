import { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useListBooks } from "./hooks/useBooks";
import { createBook } from "./api";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./index.css";

// Corrige ícones do Leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function App() {
  return (
    <Router>
      {/* Navegação */}
      <div className="p-4 flex justify-center gap-4 bg-gray-100">
        <Link to="/map" className="px-4 py-2 bg-blue-600 text-white rounded">Mapa</Link>
        <Link to="/books" className="px-4 py-2 bg-green-600 text-white rounded">Book Share</Link>
      </div>

      {/* Rotas */}
      <Routes>
        <Route path="/map" element={<MapScreen />} />
        <Route path="/books" element={<BooksScreen />} />
        <Route path="*" element={<BooksScreen />} /> {/* rota padrão */}
      </Routes>
    </Router>
  );
}

// ====== Tela do mapa ======
function MapScreen() {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current && mapContainerRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([-15.7797, -47.9297], 4);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap",
      }).addTo(mapRef.current);

      mapRef.current.invalidateSize();
    }
  }, []);

  async function handleSearch() {
    const query = searchInputRef.current.value;
    if (!query.trim()) return;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.length === 0) {
      alert("Local não encontrado!");
      return;
    }

    const { lat, lon, display_name } = data[0];
    const map = mapRef.current;

    map.setView([lat, lon], 16);
    L.marker([lat, lon]).addTo(map).bindPopup(display_name).openPopup();
  }

  return (
    <div className="w-full max-w-5xl h-[400px] mx-auto mt-6 relative">
      {/* Barra de busca */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 w-full flex justify-center">
        <div className="input-group flex max-w-xl gap-2 bg-white p-2 rounded-xl shadow">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Busque um local..."
            className="p-2 border rounded-lg flex-1"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 rounded-lg"
          >
            Buscar
          </button>
        </div>
      </div>

      {/* Mapa */}
      <div
        id="map"
        ref={mapContainerRef}
        className="w-full h-full rounded-xl shadow"
      />
    </div>
  );
}

// ====== Tela de livros ======
function BooksScreen() {
  const { books, loading, error, reload } = useListBooks();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title || !author) return;
    await createBook({ title, author });
    setTitle("");
    setAuthor("");
    reload();
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center gap-6 p-4">
      <h1 className="text-3xl font-bold">Book Share</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded-2xl shadow w-full max-w-md flex flex-col gap-3"
      >
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded-xl p-2"
        />
        <input
          type="text"
          placeholder="Autor"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="border rounded-xl p-2"
        />
        <button className="p-2 bg-blue-600 text-white rounded-xl">
          Adicionar Livro
        </button>
      </form>

      <div className="w-full max-w-md bg-white p-4 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-3">Livros cadastrados</h2>

        {loading && <p>Carregando...</p>}
        {error && <p className="text-red-500">Erro ao carregar livros.</p>}

        <ul className="flex flex-col gap-2">
          {books.map((b) => (
            <li key={b.id} className="border p-2 rounded-xl flex justify-between">
              <span>{b.title}</span>
              <span className="text-gray-500 text-sm">{b.author}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

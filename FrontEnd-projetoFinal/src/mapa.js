// Inicializa o mapa centralizado no Brasil
const map = L.map('map').setView([-15.793889, -47.882778], 4);

// Camada do OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
}).addTo(map);

// Variável que guarda a marcação atual
let marcacaoAtual = null;

// Evento do botão de busca
document.getElementById('searchBtn').addEventListener('click', async () => {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) return;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(url);
        const results = await response.json();

        if (results.length > 0) {
            const { lat, lon, display_name } = results[0];

            // Se já existir uma marcação, remove antes de adicionar outra
            if (marcacaoAtual) {
                map.removeLayer(marcacaoAtual);
            }

            // Adiciona a nova marcação no mapa
            marcacaoAtual = L.marker([lat, lon]).addTo(map)
                .bindPopup(display_name)
                .openPopup();

            // Centraliza o mapa no local encontrado
            map.setView([lat, lon], 14);

        } else {
            alert('Nenhum local encontrado.');
        }
    } catch (error) {
        console.error('Ocorreu um erro ao buscar o local:', error);
        alert('Ocorreu um erro ao buscar o local');
    }
});

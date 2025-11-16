import axios from "axios";
const API_KEY = process.env.GOOGLE_API_KEY;

const getAddressFromCoords = async (lat, lng) => {
  try {
    // Validar coordenadas
    if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
      console.error("❌ Coordenadas inválidas:", { lat, lng });
      return null;
    }

    // Verificar se a API key está configurada
    if (!API_KEY) {
      console.error("❌ GOOGLE_API_KEY não está configurada no .env");
      return null;
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`;
    console.log("🌐 Chamando API do Google Geocoding...");

    const res = await axios.get(url);

    const data = res.data;

    // Verificar status da resposta
    if (data.status === 'OK' && data.results && data.results.length > 0) {
      const endereco = data.results[0].formatted_address;
      console.log("✅ Endereço obtido:", endereco);
      return endereco;
    } else {
      console.warn("⚠️ Status da API:", data.status, "- Mensagem:", data.error_message || "Nenhum resultado encontrado");
      return null;
    }
  } catch (error) {
    console.error("❌ Erro no geocode:", error.message);
    if (error.response) {
      console.error("   Status:", error.response.status);
      console.error("   Data:", error.response.data);
    }
    return null;
  }
};

export default getAddressFromCoords;

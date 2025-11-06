import axios from "axios";
const API_KEY = process.env.GOOGLE_API_KEY;

const getAddressFromCoords = async (lat, lng) => {
  try {
    const res = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`
    );

    console.log(" Chave da API:", API_KEY ? "Carregada ✅" : "NÃO carregada ❌");


    const data = res.data;
    console.log("🛰️ Resposta do Google:", JSON.stringify(data, null, 2));


    if (data.results && data.results.length > 0) {
        console.log(API_KEY)
      return data.results[0].formatted_address;
      
    }

    return null;
  } catch (error) {
    console.error("Erro no geocode: ", error);
    return null;
  }
};

export default getAddressFromCoords;

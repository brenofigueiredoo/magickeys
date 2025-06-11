import * as Location from "expo-location";
import { Platform } from "react-native";

export async function getWeatherInfo() {
  try {
    // Tenta obter localização do usuário
    const location = await getUserLocation();

    // Busca clima usando a localização
    const weather = await getWeatherFreeAPI(
      location.latitude,
      location.longitude
    );

    return {
      success: true,
      location: location,
      weather: weather,
    };
  } catch (error) {
    console.error("Erro ao obter clima:", error);

    // Fallback: clima de Janaúba, MG (sua localização padrão)
    return await getFallbackWeather();
  }
}

async function getUserLocation() {
  try {
    if (Platform.OS !== "web") {
      // Solicita permissão para acessar localização
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        throw new Error("Permissão de localização negada");
      }

      // Obtém a localização atual
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 10000,
        distanceInterval: 1,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
      };
    }
    // Para Web
    else {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error("Geolocalização não suportada"));
          return;
        }

        const options = {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 600000, // Cache por 10 min
        };

        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
            });
          },
          (error) => {
            console.warn("Erro na geolocalização:", error.message);
            reject(error);
          },
          options
        );
      });
    }
  } catch (error) {
    console.error("Erro ao obter localização:", error);
    throw error;
  }
}

async function getWeatherFreeAPI(lat, lon) {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=America/Sao_Paulo`
    );

    if (!response.ok) {
      throw new Error("API Open-Meteo falhou");
    }

    const data = await response.json();
    return formatOpenMeteoData(data);
  } catch (error) {
    console.error("Open-Meteo falhou:", error);
    throw error;
  }
}

function formatOpenMeteoData(data) {
  const current = data.current_weather;

  return {
    temperature: Math.round(current.temperature),
    feelsLike: Math.round(current.temperature), // Open-Meteo não tem feels_like na versão gratuita
    humidity: null, // Não disponível na versão gratuita
    description: getWeatherDescription(current.weathercode),
    icon: getWeatherIconFromCode(current.weathercode),
    city: "Sua localização",
    country: "BR",
    windSpeed: Math.round(current.windspeed),
    windDirection: current.winddirection,
    isDay: current.is_day === 1,
    time: current.time,
    source: "Open-Meteo",
  };
}

// Fallback para Janaúba, MG
async function getFallbackWeather() {
  try {
    const janaubaLat = -15.8014;
    const janaubaLon = -43.3089;

    const weather = await getWeatherFreeAPI(janaubaLat, janaubaLon);

    return {
      success: true,
      location: {
        latitude: janaubaLat,
        longitude: janaubaLon,
        city: "Janaúba, MG",
      },
      weather: {
        ...weather,
        city: "Janaúba, MG",
      },
      fallback: true,
    };
  } catch (error) {
    return {
      success: false,
      location: { city: "Janaúba, MG" },
      weather: {
        temperature: 28,
        feelsLike: 32,
        humidity: 65,
        description: "clima tropical",
        icon: "☀️",
        city: "Janaúba, MG",
        source: "Estimativa local",
      },
      fallback: true,
      error: "APIs indisponíveis",
    };
  }
}

function getWeatherIconFromCode(code) {
  const codeMap = {
    0: "☀️", // Clear sky
    1: "🌤️", // Mainly clear
    2: "⛅", // Partly cloudy
    3: "☁️", // Overcast
    45: "🌫️", // Fog
    48: "🌫️", // Depositing rime fog
    51: "🌦️", // Light drizzle
    53: "🌦️", // Moderate drizzle
    55: "🌧️", // Dense drizzle
    56: "🌨️", // Light freezing drizzle
    57: "🌨️", // Dense freezing drizzle
    61: "🌧️", // Slight rain
    63: "🌧️", // Moderate rain
    65: "🌧️", // Heavy rain
    66: "🌨️", // Light freezing rain
    67: "🌨️", // Heavy freezing rain
    71: "❄️", // Slight snow fall
    73: "❄️", // Moderate snow fall
    75: "❄️", // Heavy snow fall
    77: "❄️", // Snow grains
    80: "🌦️", // Slight rain showers
    81: "🌦️", // Moderate rain showers
    82: "🌧️", // Violent rain showers
    85: "🌨️", // Slight snow showers
    86: "🌨️", // Heavy snow showers
    95: "⛈️", // Thunderstorm slight or moderate
    96: "⛈️", // Thunderstorm with slight hail
    99: "⛈️", // Thunderstorm with heavy hail
  };

  return codeMap[code] || "🌤️";
}

function getWeatherDescription(code) {
  const descriptions = {
    0: "céu limpo",
    1: "predominantemente limpo",
    2: "parcialmente nublado",
    3: "nublado",
    45: "neblina",
    48: "neblina com geada",
    51: "garoa leve",
    53: "garoa moderada",
    55: "garoa intensa",
    56: "garoa com geada leve",
    57: "garoa com geada intensa",
    61: "chuva leve",
    63: "chuva moderada",
    65: "chuva forte",
    66: "chuva com geada leve",
    67: "chuva com geada forte",
    71: "neve leve",
    73: "neve moderada",
    75: "neve intensa",
    77: "grãos de neve",
    80: "pancadas de chuva leves",
    81: "pancadas de chuva moderadas",
    82: "pancadas de chuva fortes",
    85: "pancadas de neve leves",
    86: "pancadas de neve fortes",
    95: "tempestade",
    96: "tempestade com granizo leve",
    99: "tempestade com granizo forte",
  };

  return descriptions[code] || "condições variáveis";
}

export async function getFormattedWeather() {
  const info = await getWeatherInfo();

  if (info.success) {
    const { weather } = info;
    return `${weather.icon} ${weather.temperature}°C - ${weather.description} em ${weather.city}`;
  } else {
    return `${info.weather.icon} ${info.weather.temperature}°C - ${info.weather.description} (estimativa)`;
  }
}

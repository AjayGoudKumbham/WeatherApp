import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const API_URL = import.meta.env.VITE_OPENWEATHER_API_URL;

export const fetchWeatherByCity = async (city) => {
  try {
    const response = await axios.get(`${API_URL}/weather?q=${city}&appid=${API_KEY}`);
    return transformWeatherData(response.data);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch weather data');
  }
};

export const fetchWeatherByCoords = async (lat, lon) => {
  try {
    const response = await axios.get(
      `${API_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    return transformWeatherData(response.data);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch weather data');
  }
};

export const fetchForecast = async (city) => {
  try {
    const response = await axios.get(
      `${API_URL}/forecast?q=${city}&appid=${API_KEY}`
    );
    return transformForecastData(response.data);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch forecast data');
  }
};

const transformWeatherData = (data) => ({
  city: data.name,
  temp: data.main.temp,
  humidity: data.main.humidity,
  windSpeed: data.wind.speed,
  description: data.weather[0].description,
  icon: data.weather[0].icon,
});

const transformForecastData = (data) => {
  const dailyForecasts = data.list.reduce((acc, item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = {
        temps: [],
        icons: [],
        descriptions: [],
      };
    }
    acc[date].temps.push(item.main.temp);
    acc[date].icons.push(item.weather[0].icon);
    acc[date].descriptions.push(item.weather[0].description);
    return acc;
  }, {});

  return Object.entries(dailyForecasts).slice(0, 5).map(([date, data]) => ({
    date,
    temp: {
      min: Math.min(...data.temps),
      max: Math.max(...data.temps),
    },
    description: data.descriptions[0],
    icon: data.icons[0],
  }));
};
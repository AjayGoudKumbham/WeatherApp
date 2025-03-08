import { create } from 'zustand';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

const fetchWeatherData = async (city) => {
  try {
    // Get current weather
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
    );
    const data = await response.json();
    
    if (data.cod !== 200) {
      throw new Error(data.message);
    }

    // Get 5-day forecast
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`
    );
    const forecastData = await forecastResponse.json();

    return {
      city: data.name,
      temp: data.main.temp,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
      pressure: data.main.pressure,
      visibility: data.visibility / 1000, // Convert to km
      forecast: forecastData.list.slice(0, 8).map(item => ({
        time: item.dt,
        temp: item.main.temp,
        description: item.weather[0].description,
        icon: item.weather[0].icon
      }))
    };
  } catch (error) {
    throw new Error(`Failed to fetch weather data: ${error.message}`);
  }
};

const fetchWeatherDataByCoords = async (lat, lon) => {
  try {
    // Get current weather
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    const data = await response.json();
    
    if (data.cod !== 200) {
      throw new Error(data.message);
    }

    // Get 5-day forecast
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    const forecastData = await forecastResponse.json();

    return {
      city: data.name,
      temp: data.main.temp,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
      pressure: data.main.pressure,
      visibility: data.visibility / 1000, // Convert to km
      forecast: forecastData.list.slice(0, 8).map(item => ({
        time: item.dt,
        temp: item.main.temp,
        description: item.weather[0].description,
        icon: item.weather[0].icon
      }))
    };
  } catch (error) {
    throw new Error(`Failed to fetch weather data: ${error.message}`);
  }
};

const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          reject(new Error('Unable to retrieve your location'));
        }
      );
    }
  });
};

export const useWeatherStore = create((set, get) => ({
  cities: [],
  loading: false,
  error: null,
  darkMode: false,
  selectedCity: null,
  units: {
    temperature: 'celsius',
    speed: 'kmh',
  },
  locationAsked: false,

  initializeUserLocation: async () => {
    if (!get().locationAsked) {
      set({ loading: true, locationAsked: true });
      try {
        const coords = await getUserLocation();
        const weatherData = await fetchWeatherDataByCoords(coords.lat, coords.lon);
        set({
          cities: [weatherData],
          loading: false,
          error: null
        });
      } catch (error) {
        // If geolocation fails, load a default city
        try {
          const weatherData = await fetchWeatherData('London');
          set({
            cities: [weatherData],
            loading: false,
            error: null
          });
        } catch (innerError) {
          set({ 
            error: innerError.message,
            loading: false
          });
        }
      }
    }
  },

  fetchCity: async (cityName) => {
    set({ loading: true, error: null });
    try {
      const weatherData = await fetchWeatherData(cityName);
      set(state => ({
        cities: [
          ...state.cities.filter(c => c.city.toLowerCase() !== cityName.toLowerCase()),
          weatherData
        ],
        loading: false,
        error: null
      }));
    } catch (error) {
      set({ 
        error: error.message, 
        loading: false 
      });
    }
  },

  setSelectedCity: (cityName) =>
    set(state => ({
      selectedCity: state.selectedCity === cityName ? null : cityName
    })),

  removeCity: (cityName) =>
    set(state => ({
      cities: state.cities.filter(c => c.city !== cityName),
      selectedCity: state.selectedCity === cityName ? null : state.selectedCity
    })),

  toggleDarkMode: () =>
    set(state => ({ darkMode: !state.darkMode })),

  toggleTemperatureUnit: () =>
    set(state => ({
      units: {
        ...state.units,
        temperature: state.units.temperature === 'celsius' ? 'fahrenheit' : 'celsius'
      }
    })),

  toggleSpeedUnit: () =>
    set(state => ({
      units: {
        ...state.units,
        speed: state.units.speed === 'kmh' ? 'mph' : 'kmh'
      }
    }))
}));
export interface WeatherData {
  city: string;
  temp: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
}

export interface ForecastData {
  date: string;
  temp: {
    min: number;
    max: number;
  };
  description: string;
  icon: string;
}

export interface WeatherState {
  cities: WeatherData[];
  forecast: ForecastData[];
  loading: boolean;
  error: string | null;
  darkMode: boolean;
  units: {
    temperature: 'celsius' | 'fahrenheit';
    speed: 'kmh' | 'mph';
  };
  toggleDarkMode: () => void;
  toggleTemperatureUnit: () => void;
  toggleSpeedUnit: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addCity: (city: WeatherData) => void;
  removeCity: (cityName: string) => void;
  setForecast: (forecast: ForecastData[]) => void;
}
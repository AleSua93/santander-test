import { WeatherForecast } from "../interfaces/forecasts";

export default class ApiService {
  private apiUrl: string | undefined;

  constructor() {
    this.apiUrl = process.env.REACT_APP_API_URL;
  }

  public async getWeatherForecasts(): Promise<WeatherForecast[]> {
    const endpointUri = "/weather/forecasts";

    const response = await fetch(`${this.apiUrl}${endpointUri}`);
    const data = await response.json();
    
    return data;
  }
} 
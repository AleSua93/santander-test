import config from "../configuration/config";
import axios from 'axios';
import { WeatherForecast } from "../interfaces/forecasts";

export default class WeatherService {
  private apiEndpoint: string = "https://api.weatherbit.io/v2.0/forecast/daily";
  private apiKey: string;
  private forecastsEndpoint: string;
  private lat = -34.604;
  private long = -58.382;
  
  constructor() {
    if (!config.weatherbitApiKey) {
      throw new Error("Weather API key is invalid");
    } else {
      this.apiKey = config.weatherbitApiKey;

      this.forecastsEndpoint = 
        `${this.apiEndpoint}?lat=${this.lat}&lon=${this.long}&key=${this.apiKey}`;
    }
  }

  // Returns the weather forecasts for the next 16 days
  async getForecasts(): Promise<WeatherForecast[]> {
    const response = await axios.get(this.forecastsEndpoint);

    const forecasts: WeatherForecast[] = response.data.data.map((el: any) => {
      return {
        date: el.datetime,
        temp: el.temp 
      };
    });

    return forecasts;
  }
  
  // Returns a forecast for a particular date
  async getForecast(date: string): Promise<WeatherForecast> {
    const response = await axios.get(this.forecastsEndpoint);

    const forecast = response.data.data.find((el: any) => {
      return el.datetime === date;
    });

    return {
      date: forecast.datetime,
      temp: parseFloat(forecast.temp)
    };;
  }
}
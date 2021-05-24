import config from "../configuration/config";
import axios from 'axios';
import { WeatherForecast } from "../interfaces/forecasts";
import * as fs from 'fs';

export default class WeatherService {
  private apiEndpoint: string = "https://api.weatherbit.io/v2.0/forecast/daily";
  private apiKey: string;
  private forecastsEndpoint: string;
  // Latlon for Buenos Aires
  private lat = -34.604;
  private long = -58.382;
  private cachePath = "./cache/weather-cache.json";
  
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
    let forecastsBuffer: Buffer;
    let forecasts: WeatherForecast[];
    try {
      forecastsBuffer = fs.readFileSync(this.cachePath);
      console.log("Returning data from cache...");
      forecasts = JSON.parse(forecastsBuffer.toString());
    } catch (err) {
      console.log("Cache not found, refreshing...");
      try {
        forecasts = await this.refreshCache();
      } catch(err) {
        throw new Error("Error fetching weather data, is API key ok?")
      }
    }
    
    return forecasts;
  }
  
  // Returns a forecast for a particular date
  async getForecast(date: string): Promise<WeatherForecast | null> {
    const response = await axios.get(this.forecastsEndpoint);

    const forecast = response.data.data.find((el: any) => {
      return el.datetime === date;
    });

    if (!forecast) return null;

    return {
      date: forecast.datetime,
      temp: parseFloat(forecast.temp)
    };;
  }

  async refreshCache(): Promise<WeatherForecast[]> {
    const response = await axios.get(this.forecastsEndpoint);
    const forecasts: WeatherForecast[] = response.data.data.map((el: any) => {
      return {
        date: el.datetime,
        temp: el.temp 
      };
    });

    fs.writeFileSync(this.cachePath, JSON.stringify(forecasts));

    console.log("Cache refreshed");

    return forecasts;
  }
}
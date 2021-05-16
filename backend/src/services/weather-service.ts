import config from "../configuration/config";
import axios from 'axios';
import Forecast from "../interfaces/forecast";

export default class WeatherService {
  private apiEndpoint: string = "https://api.weatherbit.io/v2.0/forecast/daily";
  private apiKey: string;
  private lat = -34.604;
  private long = -58.382;
  
  constructor() {
    if (!config.weatherbitApiKey) {
      throw new Error("Weather API key is invalid");
    } else {
      this.apiKey = config.weatherbitApiKey;
    }
  }
  
  async getForecasts(): Promise<Forecast[]> {
    const url = `${this.apiEndpoint}?lat=${this.lat}&lon=${this.long}&key=${this.apiKey}`;
    const response = await axios.get(url);

    const forecasts: Forecast[] = response.data.data.map((el: any) => {
      return {
        date: el.datetime,
        temp: el.temp 
      };
    });

    return forecasts;
  }

}
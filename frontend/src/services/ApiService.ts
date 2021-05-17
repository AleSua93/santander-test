import { BeersForecast, WeatherForecast } from "../interfaces/forecasts";
import { MeetupFormData } from "../interfaces/meetups";

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

  public async getNumberOfBeerPacks(date: string, numPeople: number): Promise<number> {
    const endpointUrl = new URL(`${this.apiUrl}/beers/forecast`);
    endpointUrl.searchParams.append('date', date);
    endpointUrl.searchParams.append('people', numPeople.toString());

    const response = await fetch(endpointUrl.toString());
    const data: BeersForecast = await response.json();
    
    return data.beerPacks;
  }

  public async createMeetup(formData: MeetupFormData) {
    console.log("Creating meetup");
  }
} 
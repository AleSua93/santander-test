import { BeersForecast, WeatherForecast } from "../interfaces/forecasts";
import { Meetup } from "../interfaces/meetups";

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

  public async getNumberOfBeerPacks(date: string, numPeople: number): Promise<number | null> {
    const endpointUrl = new URL(`${this.apiUrl}/beers/forecast`);
    endpointUrl.searchParams.append('date', date);
    endpointUrl.searchParams.append('people', numPeople.toString());

    const response = await fetch(endpointUrl.toString());

    if (response.status === 404) {
      return null;
    }

    const data: BeersForecast = await response.json();
    
    return data.beerPacks;
  }

  public async createMeetup(form: Meetup) {
    const endpointUrl = new URL(`${this.apiUrl}/meetups`);

    const options: RequestInit = {
      method: "POST",
      body: JSON.stringify(form),
      headers: {
        'Content-Type': 'application/json'
      },
    }

    const response = await fetch(endpointUrl.toString(), options);
    const data = await response.json();

    console.log(data);
  }

  public async getUpcomingMeetups(): Promise<Meetup[]> {
    const endpointUrl = new URL(`${this.apiUrl}/meetups`);

    const options: RequestInit = {
      method: "GET"
    }

    const response = await fetch(endpointUrl.toString(), options);
    const data: Meetup[] = await response.json();

    return data;
  }
} 
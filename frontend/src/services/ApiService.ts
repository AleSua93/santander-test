import { BeersForecast, WeatherForecast } from "../interfaces/forecasts";
import { LoginData } from "../interfaces/login-data";
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

  public async createMeetup(form: Meetup): Promise<Meetup> {
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

    return data as Meetup;
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

  public async login(loginData: LoginData): Promise<any> {
    const endpointUrl = new URL(`${this.apiUrl}/auth/login`);

    const options: RequestInit = {
      method: "POST",
      body: JSON.stringify(loginData),
      headers: {
        'Content-Type': 'application/json'
      },
    }

    const response = await fetch(endpointUrl.toString(), options);
    const data = await response.json();
    console.log(data);

    return data;
  }
} 
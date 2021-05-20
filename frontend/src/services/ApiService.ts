import { BeersForecast, WeatherForecast } from "../interfaces/forecasts";
import { LoginData } from "../interfaces/login-data";
import jwt_decode from "jwt-decode";
import { Meetup } from "../interfaces/meetups";

export default class ApiService {
  private apiUrl: string | undefined;
  public jwt: string | undefined;

  constructor() {
    this.apiUrl = process.env.REACT_APP_API_URL;
  }

  public async getWeatherForecasts(jwt?: string): Promise<WeatherForecast[]> {
    const endpointUri = "/weather/forecasts";

    const options: RequestInit = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + jwt,
      }
    }

    const response = await fetch(`${this.apiUrl}${endpointUri}`, options);
    const data = await response.json();
    
    return data;
  }

  public async getNumberOfBeerPacks(date: string, numPeople: number, jwt?: string): Promise<number | null> {
    const endpointUrl = new URL(`${this.apiUrl}/beers/forecast`);
    endpointUrl.searchParams.append('date', date);
    endpointUrl.searchParams.append('people', numPeople.toString());

    const options: RequestInit = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + jwt,
      }
    }
    const response = await fetch(endpointUrl.toString(), options);

    if (response.status === 404) {
      return null;
    }

    const data: BeersForecast = await response.json();
    
    return data.beerPacks;
  }

  public async createMeetup(form: Meetup, jwt?: string): Promise<Meetup> {
    const endpointUrl = new URL(`${this.apiUrl}/meetups`);

    const options: RequestInit = {
      method: "POST",
      body: JSON.stringify(form),
      headers: {
        'Content-Type': 'application/json',
        Authorization: "Bearer " + jwt,
      },
    }

    const response = await fetch(endpointUrl.toString(), options);
    const data = await response.json();

    return data as Meetup;
  }

  public async getUpcomingMeetups(jwt?: string): Promise<Meetup[]> {
    const endpointUrl = new URL(`${this.apiUrl}/meetups`);

    const options: RequestInit = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + jwt,
      },
    }

    const response = await fetch(endpointUrl.toString(), options);
    const data: Meetup[] = await response.json();

    return data;
  }
} 
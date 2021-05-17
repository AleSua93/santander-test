import { BeersForecast, WeatherForecast } from "../interfaces/forecasts";

export default class BeersService {
  constructor() {}

  public getNumBeerPacks(tempInCelsius: number, numPeople: number): number {
    let numBeers = 0;
    
    if (tempInCelsius < 20) {
      numBeers = 0.75 * numPeople;
    } else if (tempInCelsius > 24) {
      numBeers = 2 * numPeople;
    } else {
      numBeers = numPeople;
    }

    const numPacks = Math.ceil(numBeers / 6);

    return Math.ceil(numPacks);
  }
}
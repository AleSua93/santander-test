export interface WeatherForecast {
  date: string,
  temp: number
}

export interface BeersForecast extends WeatherForecast {
  beerPacks: number
}
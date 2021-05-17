interface WeatherForecast {
  date: string,
  temp: number
}

interface BeersForecast extends WeatherForecast {
  beerPacks: number
}

export { WeatherForecast, BeersForecast }
import React, { useEffect, useState } from "react";
import CreateMeetupForm from "../components/CreateMeetupForm/CreateMeetupForm";
import WeatherForecastsList from "../components/WeatherForecastsList/WeatherForecastsList";
import { WeatherForecast } from "../interfaces/forecasts";
import ApiService from "../services/ApiService";

const Admin =() =>{
  const [apiService] = useState<ApiService>(new ApiService());
  const [weatherForecasts, setWeatherForecasts] = useState<WeatherForecast[] | null>([]);

  useEffect(() => {
    apiService.getWeatherForecasts().then((forecasts) => {
      setWeatherForecasts(forecasts);
    });
  }, []);

  return(
    <>
    <div className="flex flex-col items-start md:flex-row p-5">
      <WeatherForecastsList forecasts={weatherForecasts} />
      <CreateMeetupForm />
    </div>
    </>
  )
}

export default Admin;
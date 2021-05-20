import React, { useEffect, useState } from "react";
import CreateMeetupForm from "../components/CreateMeetupForm/CreateMeetupForm";
import WeatherForecastsList from "../components/WeatherForecastsList/WeatherForecastsList";
import { useAuth } from "../hooks/useAuth";
import { WeatherForecast } from "../interfaces/forecasts";
import ApiService from "../services/ApiService";

type AdminPageProps = {
  apiService: ApiService;
}

const Admin =({ apiService }: AdminPageProps) =>{
  const [weatherForecasts, setWeatherForecasts] = useState<WeatherForecast[] | null>([]);
  const auth = useAuth();

  useEffect(() => {
    apiService.getWeatherForecasts(auth && auth.jwt).then((forecasts) => {
      setWeatherForecasts(forecasts);
    });
  }, []);

  return(
    <>
    <div className="flex flex-col items-start md:flex-row p-5">
      <WeatherForecastsList forecasts={weatherForecasts} />
      <CreateMeetupForm apiService={apiService}/>
    </div>
    </>
  )
}

export default Admin;
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { WeatherForecast } from "../../interfaces/forecasts";
import ApiService from "../../services/ApiService";

type WeatherForecastsListProps = {
  apiService: ApiService;
}

const WeatherForecastsList = ({ apiService }: WeatherForecastsListProps) =>{
  const [weatherForecasts, setWeatherForecasts] = useState<WeatherForecast[] | null>([]);
  const [showCacheRefreshedNotification, setShowCacheRefreshedNotification] = useState<boolean>(false);
  const auth = useAuth();

  useEffect(() => {
    apiService.getWeatherForecasts(auth && auth.jwt).then((forecasts) => {
      setWeatherForecasts(forecasts);
    });
  }, []);
  
  const handleRefreshCache = async () => {
    const forecasts = await apiService.refreshWeatherCache(auth && auth.jwt);
    setWeatherForecasts(forecasts);

    setShowCacheRefreshedNotification(true);
    setTimeout(() => {
      setShowCacheRefreshedNotification(false);
    }, 3000);
  }

  return(
    <>
      <div className="flex-grow self-stretch bg-white border-2 border-red-200 rounded shadow-md p-3 my-3 md:mx-3">
        <div className="flex flex-row justify-between items-baseline">
          <div className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate mb-5">
            Weather forecasts
          </div>
          <div className="flex flex-row">
            {showCacheRefreshedNotification ? 
              <div className="flex items-center text-center text-gray bg-red-300 rounded p-2 mr-2">
                Cache refreshed!
              </div> : ""
            }
            <button className="btn btn-santander" onClick={handleRefreshCache}>Refresh cache</button>
          </div>
        </div>
        <ul className="divide-y-2 divide-gray-300">
        {weatherForecasts ?
            weatherForecasts.map((forecast, idx) => {
              return <li key={`forecast-${idx}`} className="py-2 flex gap-3">
                  <div><span className="font-bold">Date: </span>{forecast.date}</div>
                  <div><span className="font-bold">Temp: </span>{forecast.temp} °C</div>
              </li>
            })
          :""}
        </ul>
      </div>
    </>
  )
}

export default WeatherForecastsList;
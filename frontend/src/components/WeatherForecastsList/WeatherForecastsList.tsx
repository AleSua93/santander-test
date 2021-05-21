import { WeatherForecast } from "../../interfaces/forecasts";

type WeatherForecastsListProps = {
  forecasts: WeatherForecast[] | null;
  onRefreshCache: () => Promise<void>;
  showCacheRefreshedNotification: boolean;
}

const WeatherForecastsList = (props: WeatherForecastsListProps) =>{
  return(
    <>
      <div className="flex-grow self-stretch bg-white border-2 border-red-200 rounded shadow-md p-3 my-3 md:mx-3">
        <div className="flex flex-row justify-between">
          <div className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate mb-5">
            Weather forecasts
          </div>
          <div className="flex flex-row">
            {props.showCacheRefreshedNotification ? 
              <div className="flex items-center text-center text-gray bg-red-300 rounded p-2 mr-2">
                Cache refreshed!
              </div> : ""
            }
            <button className="btn btn-santander" onClick={props.onRefreshCache}>Refresh cache</button>
          </div>
        </div>
        <ul className="divide-y-2 divide-gray-300">
        {props.forecasts ?
            props.forecasts.map((forecast, idx) => {
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
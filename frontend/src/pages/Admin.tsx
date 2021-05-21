import React from "react";
import CreateMeetupForm from "../components/CreateMeetupForm/CreateMeetupForm";
import WeatherForecastsList from "../components/WeatherForecastsList/WeatherForecastsList";
import ApiService from "../services/ApiService";

type AdminPageProps = {
  apiService: ApiService;
}

const Admin =({ apiService }: AdminPageProps) =>{
  return(
    <>
      <div className="flex flex-col items-start md:flex-row p-5">
        <WeatherForecastsList apiService={apiService}/>
        <CreateMeetupForm apiService={apiService}/>
      </div>
    </>
  )
}

export default Admin;
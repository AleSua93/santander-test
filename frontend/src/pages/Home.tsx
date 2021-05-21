import React from "react";
import MeetupsList from "../components/MeetupsList/MeetupsList";
import ApiService from "../services/ApiService";

type HomePageProps = {
  apiService: ApiService;
}

const Home =({ apiService }: HomePageProps) =>{
  return(
    <>
      <div className="flex flex-col items-start md:flex-row p-5">
        <MeetupsList apiService={apiService} />
      </div>
    </>
  )
}

export default Home;
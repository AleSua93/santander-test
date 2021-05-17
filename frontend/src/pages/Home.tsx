import React from "react";
import ApiService from "../services/ApiService";

type HomePageProps = {
  apiService: ApiService;
}

const Home =({ apiService }: HomePageProps) =>{
  return(
    <>
    <div>Home</div>
    </>
  )
}

export default Home;
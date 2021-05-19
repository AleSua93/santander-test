import React from "react";
import LoginForm from "../components/LoginForm/LoginForm";
import ApiService from "../services/ApiService";

type LoginPageProps = {
  apiService: ApiService;
}

const Login =({ apiService }: LoginPageProps) =>{

  return(
    <>
      <div className="flex flex-row flex-grow justify-around md:flex-row p-5">
        <LoginForm apiService={apiService}/>
      </div>
    </>
  )
}

export default Login;
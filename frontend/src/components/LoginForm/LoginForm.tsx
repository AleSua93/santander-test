import React, { SyntheticEvent, useState } from "react";

type LoginData = {
  email: string;
  password: string;
}

const LoginForm = () =>{
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: ""
  })

  const handleSubmit = async (ev: SyntheticEvent) => {
    ev.preventDefault();
    console.log("Submitting...");
  }

  const handleEmailChange = (ev: SyntheticEvent<HTMLInputElement>) => {
    ev.preventDefault();
    setLoginData({
      ...loginData,
      email: ev.currentTarget.value
    })
  }

  const handlePasswordChange = (ev: SyntheticEvent<HTMLInputElement>) => {
    ev.preventDefault();
    setLoginData({
      ...loginData,
      password: ev.currentTarget.value
    })
  }

  return(
    <>
      <div className="flex flex-col bg-white border-2 border-red-200 rounded shadow-md p-5 md:w-2/5">
        <div className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate mb-5">
          Login
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <label className="flex flex-col">
            <span className="mr-2">Email</span>
            <input
              type="text"
              name="email"
              className="p-1 shadow border border-red-700 rounded focus:outline-none focus:shadow-outline" 
              value={loginData.email}
              onChange={handleEmailChange}
              required
            />
          </label>
          <label className="flex flex-col">
            <span className="mr-2">Password</span>
            <input
              type="text"
              name="password"
              className="p-1 shadow border border-red-700 rounded focus:outline-none focus:shadow-outline" 
              value={loginData.password}
              onChange={handlePasswordChange}
              required
            />
          </label>
        </form>
      </div>
    </>
  )
}

export default LoginForm;
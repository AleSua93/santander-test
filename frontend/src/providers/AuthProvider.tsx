import React, { useState } from "react";
import AuthContext from "../contexts/AuthContext";
import { LoginData } from "../interfaces/login-data";
import AuthService from "../services/AuthService";
import jwt_decode from "jwt-decode";
import { UserInfo } from "../interfaces/auth";

// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [jwt, setJwt] = useState<string | undefined>();
  const [userInfo, setUserInfo] = useState<UserInfo | undefined>();

  const login = async (loginData: LoginData) => {
    const jwt = await AuthService.login(loginData);
    const userInfo: UserInfo = jwt_decode(jwt);

    setJwt(jwt);
    setUserInfo(userInfo);
  }

  const logout = async () => {
    setJwt(undefined);
    setUserInfo(undefined);
  }

  return {
    jwt,
    userInfo,
    login,
    logout
  };
}

// Provider component
export function AuthProvider({ children }: any) {
  const auth = useProvideAuth();
  
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
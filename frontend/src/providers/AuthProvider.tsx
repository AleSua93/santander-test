import React, { useState } from "react";
import AuthContext from "../contexts/AuthContext";
import { LoginData } from "../interfaces/login-data";
import AuthService from "../services/AuthService";
import jwt_decode from "jwt-decode";
import { UserInfo } from "../interfaces/auth";

// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [accessToken, setAccessToken] = useState<string | undefined>();
  const [userInfo, setUserInfo] = useState<UserInfo | undefined>();

  const login = async (loginData: LoginData) => {
    const tokenResponse = await AuthService.login(loginData);
    const userInfo: UserInfo = jwt_decode(tokenResponse.accessToken);

    setAccessToken(tokenResponse.accessToken);
    setUserInfo(userInfo);
  }

  const logout = async () => {
    setAccessToken(undefined);
    setUserInfo(undefined);
  }

  return {
    accessToken,
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
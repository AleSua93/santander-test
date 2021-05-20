import React, { createContext } from "react";
import { LoginData } from "../interfaces/login-data";
import { UserInfo } from "../interfaces/auth";

interface IAuthContext {
  jwt?: string;
  userInfo?: UserInfo;
  login: (logindata: LoginData) => Promise<void>;
  logout: () => Promise<void>;
}

const authContext = createContext<IAuthContext | undefined>(undefined);

export default authContext;

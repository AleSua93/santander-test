import jwtDecode from "jwt-decode";
import { LoginData } from "../interfaces/login-data";

export default class AuthService {
  private static apiUrl = process.env.REACT_APP_API_URL + "/auth";

  public static async login(loginData: LoginData): Promise<any> {
    const endpointUrl = new URL(`${this.apiUrl}/login`);

    const options: RequestInit = {
      method: "POST",
      body: JSON.stringify(loginData),
      headers: {
        'Content-Type': 'application/json'
      },
    }

    const response = await fetch(endpointUrl.toString(), options);
    const token = await response.json();

    console.log(jwtDecode(token));

    return token;
  }
} 
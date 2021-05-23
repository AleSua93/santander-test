import { TokenResponse } from "../interfaces/auth";
import { LoginData } from "../interfaces/login-data";

export default class AuthService {
  private static apiUrl = process.env.REACT_APP_API_URL + "/auth";

  public static async login(loginData: LoginData): Promise<TokenResponse> {
    const endpointUrl = new URL(`${this.apiUrl}/login`);

    const options: RequestInit = {
      method: "POST",
      body: JSON.stringify(loginData),
      headers: {
        'Content-Type': 'application/json'
      },
    }

    const response = await fetch(endpointUrl.toString(), options);
    const tokenResponse: TokenResponse = await response.json();

    return tokenResponse;
  }
} 
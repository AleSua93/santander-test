interface Config {
  port: number,
  weatherbitApiKey: string | undefined,
  jwtSigningKey: string
}

const config: Config = {
  port: parseInt(process.env.PORT ?? "5000"),
  weatherbitApiKey: process.env.WEATHERBIT_API_KEY,
  jwtSigningKey: process.env.JWT_SIGNING_KEY ?? "secret"
};

export default config;
interface Config {
  port: number,
  weatherbitApiKey: string | undefined,
}

const config: Config = {
  port: parseInt(process.env.PORT ?? "5000"),
  weatherbitApiKey: process.env.WEATHERBIT_API_KEY
};

export default config;
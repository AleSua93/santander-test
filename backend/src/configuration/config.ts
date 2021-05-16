interface Config {
  port: number,
}

const config: Config = {
  port: parseInt(process.env.PORT ?? "5000"),
};

export default config;
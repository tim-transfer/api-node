import dotenv from "dotenv";

dotenv.config();

const dbHost = process.env.DB_HOST || 'localhost';
const dbUser = process.env.DB_USER || 'postgres';
const dbPassword = process.env.DB_PASSWORD || 'changeme';
const dbName = process.env.DB_NAME || 'dbname';
const dbPort = process.env.DB_PORT || '5432';
const dbDialect = process.env.DB_DIALECT || 'postgres';

const disableHelmet = process.env.DISABLE_HELMET || false;

const apiPort = 3001;
const authAttemptsBeforeBlock = process.env.AUTH_ATTEMPTS_BEFORE_BLOCK || 5;
const authBlockDurationInMinutes = process.env.AUTH_BLOCK_DURATION_MINUTES || 5;

const secret = "XhZmCkkOJIRvxJJh6Vhgeg3F06DDrSQJ";
const refreshSecret = "NqvYmJToyjT7Mo0XXM2bVUs4VdmgLu6f";
const expiresIn = "30d";

const basePath = "api";
const config = {
  swaggerOptions: {
    swaggerDefinition: {
      info: {
        title: "TimTransfer API",
        description: "API for TimTransfer",
        contact: {
          name: "Victor Girault",
          url: "https://vgirault.me/",
          email: "victor.girault536@gmail.com",
        },
      },
      basePath: `/${basePath}`,
    },
    apis: ["./routes/*.js"],
  },
  db: {
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    name: dbName,
    port: dbPort,
    dialect: dbDialect,
  },
  api: {
    port: apiPort,
    basePath,
    authAttemptsBeforeBlock: authAttemptsBeforeBlock,
    authBlockDurationInMinutes: authBlockDurationInMinutes,
  },
  jwt: {
    secret,
    refreshSecret,
    expiresIn,
  },
};

export default config;

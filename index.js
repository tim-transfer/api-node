import express from "express";
import morgan from "morgan";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import routes from "./routes/index.js";
import config from "./config.js";
import cors from "cors";
import helmet from "helmet";
import passport from "passport";
import { hookJwtStrategy } from "./services/passport.js";
import SequelizeTransport from "./utils/dbTransport.js"; // Importez le transport personnalisé
import winston from "winston";
import "./services/sequelize.js"; // Initialisation de Sequelize
import bodyParser from "body-parser";

const app = express();

// Configurez Winston pour utiliser le transport personnalisé
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new SequelizeTransport()],
});

app.use(bodyParser.json({ limit: '50mb' }));

// Cors
logger.info("✅ Cors activated");
app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));

// Disable express cache
logger.info("✅ Express caching disabled");
app.disable("etag");

// Helmet
logger.info("✅ Helmet activated");
if (!config.disabledHelmet) {
  app.use(helmet({ crossOriginResourcePolicy: false }));
}

// Passport
logger.info("✅ Passport activated");
app.use(passport.initialize());
hookJwtStrategy();

// Body parser
logger.info("✅ Body parser activated");
app.use(express.json());

// Swagger
logger.info("✅ Swagger docs activated");
const swaggerSpec = swaggerJSDoc(config.swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware Morgan pour utiliser Winston
app.use(morgan("dev"));

// Routes
logger.info("✅ Routes available");
Object.values(routes).forEach((route) =>
  app.use(`/${config.api.basePath}`, route)
);

const port = process.env.API_PORT || config.api.port;

// Démarrage du serveur
app.listen(port, () => {
  logger.info("🚀    -----------------------------   🚀");
  logger.info(`🚀     Server started on port ${port}    🚀`);
  logger.info("🚀    -----------------------------   🚀");
});

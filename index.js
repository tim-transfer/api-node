import express from 'express';
import morgan from 'morgan';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import routes from './routes/index.js';
import config from './config.js';
import cors from 'cors';
import helmet from 'helmet';
import logger from './services/logger.js';
import passport from 'passport';
import './services/sequelize.js';
import { hookJwtStrategy } from './services/passport.js';

const app = express();

// Logger
logger.info("✅ Morgan logger activated");
app.use(morgan('dev'));

// Cors
logger.info("✅ Cors activated");
app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));

// Disable express cache
logger.info("✅ Express caching disabled");
app.disable('etag');

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
logger.info("✅ Swagger docs activated")
const swaggerSpec = swaggerJSDoc(config.swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
logger.info("✅ Routes available");
Object.values(routes).forEach(route => app.use(`/${config.api.basePath}`, route));

app.listen(config.api.port, () => {
    logger.info('🚀    -----------------------------   🚀');
    logger.info(`🚀     Server started on port ${config.api.port}    🚀`);
    logger.info('🚀    -----------------------------   🚀');
})

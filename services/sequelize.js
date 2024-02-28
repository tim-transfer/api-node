import config from "../config.js";
import Sequelize from "sequelize";
import logger from "./logger.js";

const sequelize = new Sequelize(
    config.db.name,
    config.db.user,
    config.db.password,
    {
        host: config.db.host,
        port: config.db.port,
        dialect: config.db.dialect,
        timezone: '+01:00',
        dialectOptions: { encrypt: true },
        logging: false
    }
);

sequelize
    .authenticate()
    .then(() => {
        sequelize.sync({ alter: true });
        logger.info('Connection has been established successfully.');
    })
    .catch(error => {
        logger.error('Unable to connect to the database:', error);
    });

export default sequelize;
import { format, createLogger, transports, addColors } from 'winston';

const loggerConfig = {
    levels: {
        error: 0,
        warn: 1,
        debug: 2,
        info: 3
    },
    colors: {
        error: 'white redBG',
        warn: 'black yellowBG',
        debug: 'bold magenta',
        info: 'cyan'
    }
};

const fileLogger = createLogger({
    levels: loggerConfig.levels,
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(msg =>
            format.colorize().colorize(msg.level, `[${msg.timestamp}] ${msg.level.toUpperCase()}: ${msg.stack || msg.message}`)
        )
    ),
    transports: [new transports.File({ filename: 'logger.log' })]
});

addColors(loggerConfig.colors);

export default fileLogger;
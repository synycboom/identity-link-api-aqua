import winston from 'winston';

const level = process.env.LOG_LEVEL || 'info';
const logger = winston.createLogger({
  exitOnError: false,
  level,
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

export default logger;

import winston from 'winston';
import { ENV } from './constants';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== ENV.TEST) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.splat(),
        winston.format.simple()
      ),
    })
  );
}

export function getLogger(loggerName?: string) {
  if (!loggerName) return logger;
  return logger.child({ name: loggerName });
}

export { Logger } from 'winston';

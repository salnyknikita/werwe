import winston from 'winston'

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console()
  ]
})

export const logInfo = (type, description) => {
  logger.info({ time: new Date().toISOString(), type, description })
}

export const logError = (type, description) => {
  logger.error({ time: new Date().toISOString(), type, description })
}

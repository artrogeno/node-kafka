import winston from 'winston'

import { Config } from '../../../config'

class Logger {
  public logger: any

  public log: any

  public logLevel: any

  public format: any

  constructor () {
    const { log, logLevel } = Config
    this.log = log
    this.logLevel = logLevel
    this.setLogger()
  }

  private setLogger () {
    if (this.log) {
      this.addLogger()
    }
  }

  private addLogger () {
    this.logger = winston.createLogger({
      transports: [new winston.transports.Console()],
      level: this.logLevel,
      // prettyPrint: true,
      format: this.format.combine(
        this.format.colorize(),
        this.format.json()
      )
    })
  }
}

export const logger = new Logger().logger

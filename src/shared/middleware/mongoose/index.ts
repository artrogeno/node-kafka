import mongoose from 'mongoose'

import { Config } from '../../../config'
import { logger } from '../logger'

export default class Connection {
  public connection

  public user: string

  public pass: string

  public host: string

  public port: string

  public name: string

  public auth: number

  public authSrc: string

  public logger: any

  constructor () {
    const { mongo: { user, pass, host, port, name, auth, authSrc } } = Config

    this.user = user
    this.pass = pass
    this.host = host
    this.port = port
    this.name = name
    this.auth = auth
    this.authSrc = authSrc
    this.logger = logger
  }

  public getUrlConnection () {
    let auth = ''

    if (this.auth === 1) {
      auth = `${this.user}:${this.pass}@`
    }
    return `mongodb://${auth}${this.host}:${this.port}/${
      this.name
    }?authSource=${this.authSrc}`
  }

  public getDisconnect (event) {
    mongoose.connection.close(() => event())
  }

  public getDatabse (dbName) {
    return this.connection.useDb(dbName)
  }

  public disconnect () {
    return mongoose.disconnect()
  }

  public async connect () {
    try {
      const urlConnect = this.getUrlConnection()
      process.on('SIGINT', () => this.getDisconnect(() => process.exit(0)))
      const mongoConnection = await mongoose.connect(urlConnect, {
        useNewUrlParser: true
      })
      this.connection = mongoConnection.connection
    } catch (error) {
      this.logger.error('Connecting database MongoDB error: ', error)
    }
  }
}

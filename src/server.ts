import express from 'express'
import cors from 'cors'
import http from 'http'
import bodyParser from 'body-parser'

import routes from './routes'
import Connection from './shared/middleware/mongoose'
import Jwt from './shared/middleware/jwt'

export class Server extends Connection {
  public express

  public server

  constructor () {
    super()
    this.express = express()
    this.server = http.createServer(this.express)
  }

  async start () {
    const start = await this.connect().then(() => {
      this.middlewares()
      this.routes()
      return this.server
    })
    return start
  }

  private middlewares ():void {
    this.express.use(express.json())
    this.express.use(bodyParser.urlencoded({ extended: true }))
    this.express.use(bodyParser.json({ limit: '2mb ' }))
    this.express.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.header('Access-Control-Allow-Origin', '*')
      res.header(
        'Access-Control-Allow-Headers',
        'X-Requested-With, Content-Type, Authorization'
      )
      res.header(
        'Access-Control-Allow-Methods',
        'GET,PUT,PATCH,POST,DELETE,OPTIONS'
      )
      next()
    })
    this.express.use(cors())
    this.express.use(Jwt.authorization())
  }

  private routes ():void {
    this.express.get('/health', (req: express.Request, res: express.Response) => {
      res.status(200).json({ server: "server it's works!" })
    })

    this.express.use(routes)

    this.express.use((req: express.Request, res: express.Response, next: express.NextFunction): void => {
      res.status(404)
      res.json({ error: 'Not found' })
      next()
    })

    this.express.use((error, req: express.Request, res: express.Response, next: express.NextFunction): void => {
      if (error.name === 'UnauthorizedError') {
        res.status(401).json({ error: 'Please send a valid token...' })
      }
      next()
    })

    this.express.use((error, req: express.Request, res: express.Response, next: express.NextFunction): void => {
      res.status(error.status || 500)
      res.json({ error: error.message })
      next()
    })
  }
}

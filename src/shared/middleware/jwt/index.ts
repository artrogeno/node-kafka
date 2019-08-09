import { promisify } from 'util'
import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

import Route from '../../../schemas/Route'
import Messages from '../../utils/messages'
import { Config } from '../../../config'

interface JwtRequest extends Request {
  token?: any
}

class JwtMiddleware extends Messages {
  private jwtSecret: any

  constructor () {
    super()
    this.jwtSecret = Config.jwtSecret
    this.validation = this.validation.bind(this)
  }

  public async validation (req: JwtRequest, res: Response, next: NextFunction) {
    const { originalUrl, headers } = req
    const authHeader = headers.authorization

    const routes = await Route.find().where({ types: 'PUBLIC' }).lean()

    const routeList = routes.filter(route => originalUrl.indexOf(route.uri) > -1)

    if (routeList.length > 0) {
      return next()
    }

    if (!authHeader) {
      return res.status(401).json({ error: this.messages.TOKEN_NOT_PROVIDE })
    }

    const parts = authHeader.split(' ')
    if (parts.length !== 2) {
      return res.status(401).json({ error: this.messages.TOKEN_ERROR })
    }

    const [scheme, token] = parts

    if (scheme !== 'Bearer') {
      return res.status(401).json({ error: this.messages.TOKEN_ERROR_FORMAT })
    }

    try {
      const jwtVerifyAsync = promisify(jwt.verify)
      const jwtToken = await jwtVerifyAsync(token, this.jwtSecret)
      req.token = jwtToken

      return next()
    } catch (error) {
      return res.status(401).json({ error: this.messages.TOKEN_INVALID })
    }
  }

  authorization () {
    return this.validation
  }
}

export default new JwtMiddleware()

import { Request, Response } from 'express'

import Route from '../../../../schemas/Route'

class RoutesController {
  public async index (req: Request, res: Response):Promise<Response> {
    const routes = await Route.find().select('-__v -_id')
    return res.json(routes)
  }

  public async store (req: Request, res: Response):Promise<Response> {
    const route = await Route.create(req.body)

    return res.json(route)
  }
}

export default new RoutesController()

import { Router } from 'express'

import RouteController from './controllers/route.controller'

const routes = Router()

routes.get('/', RouteController.index)
routes.post('/', RouteController.store)

export default routes

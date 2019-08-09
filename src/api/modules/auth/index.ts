import { Router } from 'express'

import AuthController from './controllers/auth.controller'

const routes = Router()

routes.post('/singin', AuthController.singin)
routes.post('/singup', AuthController.singup)

export default routes

import { Router } from 'express'

import user from './modules/user'
import auth from './modules/auth'
import route from './modules/route'

const routes = Router()

routes.use('/user', user)
routes.use('/auth', auth)
routes.use('/route', route)

export default routes

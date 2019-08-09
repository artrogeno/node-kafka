import { Router } from 'express'

import apiRoutes from './api/routes'

const routes = Router()

routes.use('/api', apiRoutes)

export default routes

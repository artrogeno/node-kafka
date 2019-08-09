import { Request, Response } from 'express'

import User from '../../../../schemas/User'

class AuthController {
  public async singin (req: Request, res: Response):Promise<Response> {
    const { username = null, email = null, password } = req.body
    const user = await User.findOne({ $or: [{ username }, { email }] })

    if (!user) {
      return res.status(400).json({ error: 'User not found' })
    }

    if (!password) {
      return res.status(400).json({ error: 'Password is empty!' })
    }

    if (!user.compareHash(password)) {
      return res.status(400).json({ error: 'Invalid password' })
    }

    return res.json({
      user,
      token: user.generateToken()
    })
  }

  public async singup (req: Request, res: Response):Promise<Response> {
    const { username, email } = req.body

    if (await User.findOne({ $or: [{ username }, { email }] })) {
      return res.status(400).json({ error: 'User already exists' })
    }

    const user = await User.create(req.body)

    return res.json(user)
  }
}

export default new AuthController()

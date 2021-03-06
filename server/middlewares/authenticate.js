import jwt from 'jsonwebtoken'
import jwtSecret from '../config/jwtSecret'

export default async (ctx, next) => {
  const { username, password } = ctx.request.body

  if (password === 'password') {
    ctx.status = 200
    ctx.authenticateData = {
      token: jwt.sign({ username }, jwtSecret),
      message: 'Successfully logged in!'
    }
  } else {
    ctx.status = 401
    ctx.authenticateData = {
      message: 'Authentication failed...'
    }
  }

  await next()
}

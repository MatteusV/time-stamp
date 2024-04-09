import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { env } from './env'

export const app = fastify()

app.register(cookie, {
  secret: env.COOKIE_SECRET,
})

import 'dotenv/config'
import {z} from'zod'

const schemaEnv = z.object({
  COOKIE_SECRET: z.string(),
  DATABASE_URL: z.string(),
})


const _env = schemaEnv.safeParse(process.env)

if(_env.success === false) {
  console.error('Invalid environment variables.', _env.error.format())
  throw new Error('Invalid environment variables.')
}

export const env = _env.data
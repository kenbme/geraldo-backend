import {NestFactory} from '@nestjs/core'
import {FastifyAdapter, NestFastifyApplication} from '@nestjs/platform-fastify'
import {AppModule} from './app.module'
import {ValidationPipe} from '@nestjs/common'
import {configDotenv} from 'dotenv'
import {resolve} from 'path'

async function bootstrap(): Promise<void> {
  configDotenv({path: resolve(process.cwd(), '.development.env')})
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({logger: true})
  )
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(3000)
}
bootstrap()

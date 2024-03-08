import {ArgumentsHost, BadRequestException, Catch, ExceptionFilter} from '@nestjs/common'

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost): void {
    const context = host.switchToHttp()
    const response = context.getResponse()

    const statusCode = exception.getStatus()
    const message: any = exception.getResponse()

    response.status(statusCode).send({
      statusCode,
      message: message.message,
      data: message.error
    })
  }
}

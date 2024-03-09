import {ArgumentsHost, Catch, ExceptionFilter, HttpException} from '@nestjs/common'

@Catch(HttpException)
export class HttpExceptionExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
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

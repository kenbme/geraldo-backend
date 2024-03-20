import {ArgumentsHost, Catch, ExceptionFilter} from '@nestjs/common'
import {TypeORMError} from 'typeorm'

@Catch(TypeORMError)
export class TypeORMExceptionFilter implements ExceptionFilter {
  catch(exception: TypeORMError, host: ArgumentsHost): void {
    const context = host.switchToHttp()
    const response = context.getResponse()

    response.status(500).send({
      statusCode: 500,
      message: 'O servidor não conseguiu processar a requisição',
      data: 'Falha interna'
    })
  }
}

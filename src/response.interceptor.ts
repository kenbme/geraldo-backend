import {Injectable, NestInterceptor, ExecutionContext, CallHandler} from '@nestjs/common'
import {Observable} from 'rxjs'
import {map} from 'rxjs/operators'

export interface Response<T> {
  data: T
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<Response<T>>> {
    return next.handle().pipe(
      map((response) => {
        const statusCode = context.switchToHttp().getResponse().statusCode
        return {data: response.data, statusCode, message: response.message}
      })
    )
  }
}

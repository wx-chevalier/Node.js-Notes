import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor
} from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(err => {
        // 如果是校验错误，则二次取出数据
        if (err.message.statusCode === HttpStatus.BAD_REQUEST) {
          return throwError(
            new HttpException(err.message.message, HttpStatus.BAD_REQUEST)
          );
        } else {
          return throwError(
            new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
          );
        }
      })
    );
  }
}

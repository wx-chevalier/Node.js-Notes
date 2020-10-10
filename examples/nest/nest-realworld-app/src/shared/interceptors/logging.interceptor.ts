import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const url = context.switchToHttp().getRequest().url;

    console.log('Before... ' + url);

    const now = Date.now();

    return next
      .handle()
      .pipe(tap(() => console.log(`After... ${url} ${Date.now() - now}ms`)));
  }
}

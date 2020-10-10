import { UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

import { SECRET } from '../config';

import { HttpExceptionFilter } from './filters/http-exception.filter';
import { RolesGuard } from './guards/roles.guard';
import { ErrorsInterceptor } from './interceptors/exception.interceptor';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { TimeoutInterceptor } from './interceptors/timeout.interceptor';
import { TransformInterceptor } from './interceptors/transform.interceptor';

@UseGuards(RolesGuard)
@UseInterceptors(
  LoggingInterceptor,
  TransformInterceptor,
  TimeoutInterceptor,
  ErrorsInterceptor,
)
@UseFilters(HttpExceptionFilter)
export class BaseController {
  protected getUserIdFromToken(authorization) {
    if (!authorization) return null;

    const token = authorization.split(' ')[1];
    const decoded: any = jwt.verify(token, SECRET);
    return decoded.id;
  }
}

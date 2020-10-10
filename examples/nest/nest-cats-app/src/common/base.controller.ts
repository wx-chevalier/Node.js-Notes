import { Module, UseGuards, UseInterceptors, UseFilters } from "@nestjs/common";

import { RolesGuard } from "./guards/roles.guard";
import { LoggingInterceptor } from "./interceptors/logging.interceptor";
import { TransformInterceptor } from "./interceptors/transform.interceptor";
import { TimeoutInterceptor } from "./interceptors/timeout.interceptor";
import { ErrorsInterceptor } from "./interceptors/exception.interceptor";
import { HttpExceptionFilter } from "./filters/http-exception.filter";

@UseGuards(RolesGuard)
@UseInterceptors(
  LoggingInterceptor,
  TransformInterceptor,
  TimeoutInterceptor,
  ErrorsInterceptor
)
@UseFilters(HttpExceptionFilter)
export class BaseController {}

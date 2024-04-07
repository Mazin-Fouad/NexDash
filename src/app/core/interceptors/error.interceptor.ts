import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { ErrorHandlerService } from '../services/errorHandler/error-handler.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  handleErrorService = inject(ErrorHandlerService);
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next
      .handle(req)
      .pipe(catchError(this.handleErrorService.loggerErrorResponse));
  }
}

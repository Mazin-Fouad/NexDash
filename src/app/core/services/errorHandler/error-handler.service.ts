import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor() {}

  loggerErrorResponse(errorResponse: HttpErrorResponse): Observable<any> {
    if (errorResponse.status === 0) {
      //Client side errors
      console.log(
        `a client side error occurred: ${errorResponse.status} - ${errorResponse.error}`
      );
    } else {
      //Back-end errors
      console.log(
        `a Back-end error occurred  ${errorResponse.status} - ${errorResponse.error}`
      );
    }
    return throwError(
      () => new Error('Something bad happend, please try later')
    );
  }
}

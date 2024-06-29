import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Country } from '../../models/country';

@Injectable({
  providedIn: 'root',
})
export class CountriesService {
  api = 'https://countriesnow.space/api/v0.1/countries/flag/images';
  constructor(private http: HttpClient) {}

  getCountries(): Observable<Country[]> {
    return this.http.get<{ data: Country[] }>(this.api).pipe(
      map((response) => {
        if (response && response.data) {
          return response.data;
        }
        throw new Error('No data found');
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    // Handle client-side or network error
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      // Handle backend error
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // Return an observable with a user-facing error message
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateConversionService {
  convertTimestampToDate(timestamp?: {
    seconds: number;
    nanoseconds: number;
  }): string {
    if (
      !timestamp ||
      timestamp.seconds === undefined ||
      timestamp.nanoseconds === undefined
    ) {
      return 'N/A'; // or return an empty string or a default value
    }

    const date = new Date(
      timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
    );
    return date.toLocaleDateString(); // change format the date as needed
  }
}

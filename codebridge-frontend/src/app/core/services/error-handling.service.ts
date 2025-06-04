import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {

  constructor() { }

  /**
   * Handle HTTP errors and return a standardized error observable
   * @param operation The name of the operation that failed
   * @returns A function that handles errors for the given operation
   */
  handleError(operation = 'operation') {
    return (error: HttpErrorResponse): Observable<never> => {
      // Log the error
      console.error(`${operation} failed:`, error);

      // Create a user-friendly error message
      let errorMessage = 'An error occurred. Please try again later.';
      
      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Server-side error
        if (error.status === 401) {
          errorMessage = 'You are not authorized to perform this action. Please log in again.';
        } else if (error.status === 403) {
          errorMessage = 'You do not have permission to perform this action.';
        } else if (error.status === 404) {
          errorMessage = 'The requested resource was not found.';
        } else if (error.status === 422) {
          errorMessage = 'The provided data is invalid.';
          
          // Add validation errors if available
          if (error.error && error.error.errors) {
            const validationErrors = error.error.errors;
            errorMessage += ' ' + Object.keys(validationErrors)
              .map(key => `${key}: ${validationErrors[key].join(', ')}`)
              .join('; ');
          }
        } else if (error.status >= 500) {
          errorMessage = 'A server error occurred. Please try again later.';
        }
      }

      // Return an observable with a user-facing error message
      return throwError(() => new Error(errorMessage));
    };
  }
}


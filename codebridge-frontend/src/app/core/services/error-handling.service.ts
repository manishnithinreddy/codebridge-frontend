import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {

  constructor() { }

  /**
   * Handle HTTP errors
   * @param operation - Name of the operation that failed
   * @param result - Optional value to return as the observable result
   */
  handleError(operation = 'operation', result?: any) {
    return (error: HttpErrorResponse): Observable<any> => {
      // Log the error to console
      console.error(`${operation} failed: ${error.message}`);

      // Get a user-friendly error message
      const errorMessage = this.getErrorMessage(error, operation);

      // Let the app keep running by returning a safe result
      return throwError(() => ({ error: errorMessage, originalError: error }));
    };
  }

  /**
   * Get a user-friendly error message
   * @param error - The HTTP error response
   * @param operation - Name of the operation that failed
   * @returns A user-friendly error message
   */
  private getErrorMessage(error: HttpErrorResponse, operation: string): string {
    let errorMessage = `Error in ${operation}`;

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = this.handleBadRequestError(error);
          break;
        case 401:
          errorMessage = 'You need to log in to perform this action';
          break;
        case 403:
          errorMessage = 'You do not have permission to perform this action';
          break;
        case 404:
          errorMessage = 'The requested resource was not found';
          break;
        case 409:
          errorMessage = 'This operation could not be completed due to a conflict';
          break;
        case 422:
          errorMessage = this.handleValidationError(error);
          break;
        case 500:
          errorMessage = 'A server error occurred. Please try again later';
          break;
        default:
          errorMessage = `Server returned code ${error.status}, message was: ${error.message}`;
      }
    }

    return errorMessage;
  }

  /**
   * Handle 400 Bad Request errors
   * @param error - The HTTP error response
   * @returns A user-friendly error message
   */
  private handleBadRequestError(error: HttpErrorResponse): string {
    if (error.error && typeof error.error === 'object') {
      if (error.error.message) {
        return error.error.message;
      }
      
      if (error.error.error) {
        return error.error.error;
      }
    }
    
    return 'Invalid request. Please check your data and try again';
  }

  /**
   * Handle 422 Validation errors
   * @param error - The HTTP error response
   * @returns A user-friendly error message
   */
  private handleValidationError(error: HttpErrorResponse): string {
    if (error.error && error.error.errors && Array.isArray(error.error.errors)) {
      // Format validation errors
      return error.error.errors.map((err: any) => err.message || err).join(', ');
    }
    
    if (error.error && error.error.message) {
      return error.error.message;
    }
    
    return 'Validation failed. Please check your data and try again';
  }
}


import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LocalStorageService } from './local.storage.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get token from localStorage
    const token = localStorage.getItem('authToken');

    // Clone request and add token if available
    const clonedRequest = token
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

    // Handle the request and catch errors
    return next.handle(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle 401 Unauthorized errors
        if (error.status === 401) {
          console.warn('Unauthorized access - clearing session and redirecting to login');

          // Clear all auth-related data from localStorage
          this.clearSession();

          // Redirect to login page
          this.router.navigate(['/login']);
        }

        // Re-throw the error for other handlers
        return throwError(() => error);
      })
    );
  }

  private clearSession(): void {
    // Clear all authentication-related items
    localStorage.removeItem('authToken');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_permissions');
    localStorage.removeItem('user');

    // Also clear using LocalStorageService if needed
    this.localStorageService.removeItem('authToken');
    this.localStorageService.removeItem('access_token');
    this.localStorageService.removeItem('refresh_token');
    this.localStorageService.removeItem('user_permissions');
    this.localStorageService.removeItem('user');
  }
}

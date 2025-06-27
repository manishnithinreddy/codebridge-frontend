import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
const urlsToExclude = ['/identity/auth/login', '/identity/auth/refresh-token'];
export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService); const token = authService.getTokenFromStorage();
  const shouldExclude = urlsToExclude.some(url => req.url.includes(url));
  if (token && !shouldExclude) { req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }); }
  return next(req);
};

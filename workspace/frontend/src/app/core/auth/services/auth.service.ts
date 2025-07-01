import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiService } from '../../http/api.service';
export interface User { id: string; username: string; email: string; roles: string[]; }
export interface AuthResponse { token: string; user: User; }
@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiService = inject(ApiService); private router = inject(Router);
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(!!this.getTokenFromStorage());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  constructor() { if (this.getTokenFromStorage()) { this.currentUserSubject.next(this.getUserFromStorage()); this.isAuthenticatedSubject.next(true); } }
  private saveAuthData(token: string, user: User): void { localStorage.setItem('authToken', token); localStorage.setItem('currentUser', JSON.stringify(user)); this.currentUserSubject.next(user); this.isAuthenticatedSubject.next(true); }
  private clearAuthData(): void { localStorage.removeItem('authToken'); localStorage.removeItem('currentUser'); this.currentUserSubject.next(null); this.isAuthenticatedSubject.next(false); }
  private getUserFromStorage(): User | null { const user = localStorage.getItem('currentUser'); return user ? JSON.parse(user) : null; }
  getTokenFromStorage(): string | null { return localStorage.getItem('authToken'); }
  login(credentials: {username: string, password: string}): Observable<User> {
    return this.apiService.post<AuthResponse>('/identity/auth/login', credentials).pipe(
      map(response => { this.saveAuthData(response.token, response.user); return response.user; }),
      tap(() => this.router.navigate(['/'])),
      catchError(err => { console.error('Login failed:', err); this.clearAuthData(); return throwError(() => err); })
    );
  }
  logout(): void { this.clearAuthData(); this.router.navigate(['/login']); }
  getCurrentUser(): User | null { return this.currentUserSubject.value; }
  isAuthenticatedUser(): boolean { return this.isAuthenticatedSubject.value; }
  refreshToken(): Observable<string | null> { console.warn('Token refresh logic not implemented'); return of(null); }
}

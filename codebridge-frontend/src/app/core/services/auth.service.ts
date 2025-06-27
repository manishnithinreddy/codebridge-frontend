import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { BaseApiService } from './base-api.service';
import {
  LoginRequest,
  LoginResponse,
  User,
  RefreshTokenRequest,
  PasswordChangeRequest,
  UserRegistrationRequest,
  ApiKey,
  ApiKeyRequest,
  ApiKeyResponse,
  RbacRequest,
  RbacResponse
} from '../models';

/**
 * Authentication service
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseApiService {
  protected override readonly baseUrl = '/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    super();
    this.checkStoredAuth();
  }

  /**
   * Login user
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.post<LoginResponse>(
      '/login',
      credentials
    ).pipe(
      tap(response => {
        this.setAuthData(response);
      })
    );
  }

  /**
   * Logout user
   */
  logout(): Observable<void> {
    return this.post<void>(
      '/logout',
      {}
    ).pipe(
      tap(() => {
        this.clearAuthData();
      })
    );
  }

  /**
   * Register new user
   */
  register(userData: UserRegistrationRequest): Observable<User> {
    return this.post<User>(
      '/register',
      userData
    );
  }

  /**
   * Refresh authentication token
   */
  refreshToken(request: RefreshTokenRequest): Observable<LoginResponse> {
    return this.post<LoginResponse>(
      '/refresh',
      request
    ).pipe(
      tap(response => {
        this.setAuthData(response);
      })
    );
  }

  /**
   * Change password
   */
  changePassword(request: PasswordChangeRequest): Observable<void> {
    return this.post<void>(
      '/change-password',
      request
    );
  }

  /**
   * Get current user profile
   */
  getCurrentUser(): Observable<User> {
    return this.get<User>(
      '/me')
    ).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
      })
    );
  }

  /**
   * Update user profile
   */
  updateProfile(userData: Partial<User>): Observable<User> {
    return this.put<User>(
      '/me',
      userData
    ).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
      })
    );
  }

  /**
   * Check RBAC permissions
   */
  checkPermission(request: RbacRequest): Observable<RbacResponse> {
    return this.post<RbacResponse>(
      '/rbac/check',
      request
    );
  }

  // API Key Management

  /**
   * Get user's API keys
   */
  getApiKeys(): Observable<ApiKey[]> {
    return this.get<ApiKey[]>(
      '/api-keys')
    );
  }

  /**
   * Create new API key
   */
  createApiKey(request: ApiKeyRequest): Observable<ApiKeyResponse> {
    return this.post<ApiKeyResponse>(
      '/api-keys',
      request
    );
  }

  /**
   * Delete API key
   */
  deleteApiKey(keyId: string): Observable<void> {
    return this.delete<void>(
      `/api-keys/${keyId}`)
    );
  }

  /**
   * Activate/deactivate API key
   */
  toggleApiKey(keyId: string, isActive: boolean): Observable<ApiKey> {
    return this.patch<ApiKey>(
      `/api-keys/${keyId}`),
      { isActive }
    );
  }

  // Helper methods

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Get current user
   */
  getCurrentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user has specific permission
   */
  hasPermission(resource: string, action: string): Observable<boolean> {
    const user = this.getCurrentUserValue();
    if (!user) {
      return new Observable(observer => observer.next(false));
    }

    return this.checkPermission({
      userId: user.id,
      resource,
      action
    }).pipe(
      tap(response => response.allowed)
    );
  }

  /**
   * Check if user has role
   */
  hasRole(roleName: string): boolean {
    const user = this.getCurrentUserValue();
    return user?.roles.some(role => role.name === roleName) || false;
  }

  /**
   * Set authentication data
   */
  private setAuthData(response: LoginResponse): void {
    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('refresh_token', response.refreshToken);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    this.currentUserSubject.next(response.user);
    this.isAuthenticatedSubject.next(true);
  }

  /**
   * Clear authentication data
   */
  private clearAuthData(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Check stored authentication
   */
  private checkStoredAuth(): void {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } catch (error) {
        this.clearAuthData();
      }
    }
  }
}

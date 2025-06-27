import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService, User, AuthResponse } from './auth.service';
import { ApiService } from '../../http/api.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let router: Router;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const mockUser: User = { id: '1', username: 'testuser', email: 'test@example.com', roles: ['user'] };
  const mockAuthResponse: AuthResponse = { token: 'test-token', user: mockUser };

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ApiService', ['post']);
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule.withRoutes([]) ],
      providers: [ AuthService, { provide: ApiService, useValue: spy } ]
    });
    service = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  });

  it('should be created', () => { expect(service).toBeTruthy(); });

  it('isAuthenticated$ should emit false initially if no token', (done) => {
    service.isAuthenticated$.subscribe(isAuth => { expect(isAuth).toBeFalse(); done(); });
  });

  it('currentUser$ should emit null initially if no user', (done) => {
     service.currentUser$.subscribe(user => { expect(user).toBeNull(); done(); });
  });

  describe('login', () => {
    it('should call ApiService.post, store token/user, update subjects, and navigate on success', (done) => {
      apiServiceSpy.post.and.returnValue(of(mockAuthResponse) as any);
      const navigateSpy = spyOn(router, 'navigate').and.callThrough();
      service.login({ username: 'test@example.com', password: 'password' }).subscribe({
        next: user => {
          expect(user).toEqual(mockUser);
          expect(apiServiceSpy.post).toHaveBeenCalledWith('/identity/auth/login', { username: 'test@example.com', password: 'password' });
          expect(localStorage.getItem('authToken')).toBe('test-token');
          expect(JSON.parse(localStorage.getItem('currentUser') || '{}')).toEqual(mockUser);
          expect(service.isAuthenticatedUser()).toBeTrue(); // Check synchronous state
          expect(service.getCurrentUser()).toEqual(mockUser); // Check synchronous state
          setTimeout(() => { expect(navigateSpy).toHaveBeenCalledWith(['/']); done(); }, 0);
        },
        error: fail
      });
    });

    it('should clear auth data and return error on login failure', (done) => {
      const errorResponse = { status: 401, message: 'Invalid credentials' };
      apiServiceSpy.post.and.returnValue(throwError(() => errorResponse) as any);
      service.login({ username: 'test@example.com', password: 'password' }).subscribe({
        next: () => fail('should have failed'),
        error: (err) => {
          expect(err).toEqual(errorResponse);
          expect(localStorage.getItem('authToken')).toBeNull();
          expect(localStorage.getItem('currentUser')).toBeNull();
          expect(service.isAuthenticatedUser()).toBeFalse();
          expect(service.getCurrentUser()).toBeNull();
          done();
        }
      });
    });
  });

  describe('logout', () => {
    it('should clear auth data, update subjects, and navigate to /login', () => {
      localStorage.setItem('authToken', 'test-token');
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      service = TestBed.inject(AuthService); // Re-inject to pick up localStorage
      const navigateSpy = spyOn(router, 'navigate');
      service.logout();
      expect(localStorage.getItem('authToken')).toBeNull();
      expect(localStorage.getItem('currentUser')).toBeNull();
      expect(service.isAuthenticatedUser()).toBeFalse();
      expect(service.getCurrentUser()).toBeNull();
      expect(navigateSpy).toHaveBeenCalledWith(['/login']);
    });
  });
});

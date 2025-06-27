import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginRequest } from '../../core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>CodeBridge</h1>
          <p>Sign in to your account</p>
        </div>

        <form class="login-form" (ngSubmit)="login()" #loginForm="ngForm">
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" 
                   id="username"
                   [(ngModel)]="credentials.username" 
                   name="username"
                   placeholder="Enter your username"
                   required>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" 
                   id="password"
                   [(ngModel)]="credentials.password" 
                   name="password"
                   placeholder="Enter your password"
                   required>
          </div>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <button type="submit" 
                  class="login-btn" 
                  [disabled]="!loginForm.valid || isLoading">
            <span *ngIf="isLoading" class="spinner"></span>
            {{ isLoading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <div class="login-footer">
          <p>Don't have an account? <a href="#" (click)="showRegister = true">Sign up</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
    }

    .login-card {
      background: white;
      border-radius: 16px;
      padding: 3rem;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }

    .login-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .login-header h1 {
      margin: 0 0 0.5rem 0;
      color: #333;
      font-size: 2rem;
      font-weight: 700;
    }

    .login-header p {
      margin: 0;
      color: #666;
      font-size: 1rem;
    }

    .login-form {
      margin-bottom: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #333;
    }

    .form-group input {
      width: 100%;
      padding: 0.875rem;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s ease;
    }

    .form-group input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .error-message {
      background: #ffebee;
      color: #c62828;
      padding: 0.75rem;
      border-radius: 6px;
      margin-bottom: 1rem;
      font-size: 0.875rem;
    }

    .login-btn {
      width: 100%;
      padding: 1rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .login-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
    }

    .login-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .login-footer {
      text-align: center;
    }

    .login-footer p {
      margin: 0;
      color: #666;
      font-size: 0.875rem;
    }

    .login-footer a {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }

    .login-footer a:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  credentials: LoginRequest = {
    username: '',
    password: ''
  };

  isLoading = false;
  errorMessage = '';
  showRegister = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(): void {
    if (!this.credentials.username || !this.credentials.password) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Login failed. Please try again.';
      }
    });
  }
}

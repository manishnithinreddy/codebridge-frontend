import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/auth/services/auth.service';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-login', standalone: true,
  imports: [ CommonModule, RouterModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule ],
  templateUrl: './login.component.html', styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private fb = inject(FormBuilder); private authService = inject(AuthService); private router = inject(Router);
  loginForm = this.fb.group({ username: ['', [Validators.required, Validators.email]], password: ['', Validators.required] });
  isLoading = false; errorMessage: string | null = null;
  constructor() { if (this.authService.isAuthenticatedUser()) { this.router.navigate(['/']); } }
  onSubmit(): void {
    if (this.loginForm.invalid) { this.errorMessage = 'Please fill in all required fields correctly.'; return; }
    this.isLoading = true; this.errorMessage = null; const { username, password } = this.loginForm.value;
    this.authService.login({ username: username!, password: password! }).pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => { const returnUrl = this.router.routerState.snapshot.root.queryParams['returnUrl'] || '/'; this.router.navigateByUrl(returnUrl); },
        error: (err) => { this.errorMessage = err.message || 'Login failed.'; console.error('Login error:', err); }
      });
  }
}

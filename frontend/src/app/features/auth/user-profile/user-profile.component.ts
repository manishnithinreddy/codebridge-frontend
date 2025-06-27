import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../../core/auth/services/auth.service'; // User will be exported from AuthService
import { Observable } from 'rxjs';

// Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
  public authService = inject(AuthService);
  currentUser$: Observable<User | null> = this.authService.currentUser$;
}

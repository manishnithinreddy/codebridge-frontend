import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { authGuard } from '../../core/auth/guards/auth.guard';

export const AUTH_ROUTES: Routes = [
  { path: 'login', component: LoginComponent, title: 'CodeBridge - Login' },
  {
    path: 'profile',
    component: UserProfileComponent,
    title: 'CodeBridge - User Profile',
    canActivate: [authGuard]
  },
  { path: '', redirectTo: 'profile', pathMatch: 'full' }
];

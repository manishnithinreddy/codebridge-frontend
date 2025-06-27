import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Server } from './models/server.model'; // Corrected path: ./models/
import { ServerService } from './services/server.service'; // Corrected path: ./services/

@Component({
  selector: 'app-server-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterModule, NgClass, MatToolbarModule, MatCardModule,
    MatButtonModule, MatProgressSpinnerModule, MatIconModule
  ],
  templateUrl: './server-dashboard.component.html',
  styleUrls: ['./server-dashboard.component.scss']
})
export class ServerDashboardComponent implements OnInit {
  private serverService = inject(ServerService);
  public servers$: Observable<Server[]> | undefined;
  public isLoading = false;
  public error: string | null = null;
  constructor() {}
  ngOnInit(): void { this.loadServers(); }
  loadServers(): void {
    this.isLoading = true; this.error = null;
    this.servers$ = this.serverService.getServers().pipe(
      tap(() => this.isLoading = false),
      catchError(err => {
        console.error('Error loading servers in component:', err);
        this.error = err.message || 'Failed to load servers. Please try again later.';
        this.isLoading = false;
        return of([]);
      })
    );
  }
  viewServerDetails(serverId: string): void { console.log('Navigate to server details for:', serverId); }
  openTerminal(serverId: string): void { console.log('Open terminal for server:', serverId); }
  openFileManager(serverId: string): void { console.log('Open file manager for server:', serverId); }
}

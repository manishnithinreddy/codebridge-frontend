import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { 
  DockerService, 
  AuthService,
  User,
  ContainerInfo,
  DockerImage,
  HealthStatus
} from '../../core';

interface DashboardStats {
  containers: {
    total: number;
    running: number;
    stopped: number;
  };
  images: {
    total: number;
    size: string;
  };
  services: {
    docker: HealthStatus;
    gitlab: HealthStatus;
    ai: HealthStatus;
    monitoring: HealthStatus;
  };
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <!-- Header -->
      <div class="dashboard-header">
        <h1>CodeBridge Dashboard</h1>
        <div class="user-info" *ngIf="currentUser$ | async as user">
          <span>Welcome, {{ user.firstName || user.username }}!</span>
          <button class="btn btn-outline" (click)="logout()">Logout</button>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="stats-grid" *ngIf="dashboardStats$ | async as stats">
        <div class="stat-card">
          <div class="stat-icon">🐳</div>
          <div class="stat-content">
            <h3>{{ stats.containers.total }}</h3>
            <p>Total Containers</p>
            <small>{{ stats.containers.running }} running, {{ stats.containers.stopped }} stopped</small>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📦</div>
          <div class="stat-content">
            <h3>{{ stats.images.total }}</h3>
            <p>Docker Images</p>
            <small>{{ stats.images.size }} total size</small>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🔧</div>
          <div class="stat-content">
            <h3>9</h3>
            <p>Microservices</p>
            <small>All systems operational</small>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <h3>{{ (currentUser$ | async)?.organizations.length || 0 }}</h3>
            <p>Organizations</p>
            <small>Active memberships</small>
          </div>
        </div>
      </div>

      <!-- Service Status -->
      <div class="service-status-section">
        <h2>Service Health</h2>
        <div class="service-grid" *ngIf="dashboardStats$ | async as stats">
          <div class="service-card" 
               [class.healthy]="stats.services.docker.status === 'UP'"
               [class.unhealthy]="stats.services.docker.status !== 'UP'">
            <div class="service-header">
              <span class="service-name">Docker Service</span>
              <span class="service-status">{{ stats.services.docker.status }}</span>
            </div>
            <p>Container and image management</p>
            <a routerLink="/docker" class="service-link">Manage →</a>
          </div>

          <div class="service-card" 
               [class.healthy]="stats.services.gitlab.status === 'UP'"
               [class.unhealthy]="stats.services.gitlab.status !== 'UP'">
            <div class="service-header">
              <span class="service-name">GitLab Service</span>
              <span class="service-status">{{ stats.services.gitlab.status }}</span>
            </div>
            <p>Repository and CI/CD operations</p>
            <a routerLink="/gitlab" class="service-link">Manage →</a>
          </div>

          <div class="service-card" 
               [class.healthy]="stats.services.ai.status === 'UP'"
               [class.unhealthy]="stats.services.ai.status !== 'UP'">
            <div class="service-header">
              <span class="service-name">AI Service</span>
              <span class="service-status">{{ stats.services.ai.status }}</span>
            </div>
            <p>LLM completions and embeddings</p>
            <a routerLink="/ai" class="service-link">Manage →</a>
          </div>

          <div class="service-card" 
               [class.healthy]="stats.services.monitoring.status === 'UP'"
               [class.unhealthy]="stats.services.monitoring.status !== 'UP'">
            <div class="service-header">
              <span class="service-name">Monitoring</span>
              <span class="service-status">{{ stats.services.monitoring.status }}</span>
            </div>
            <p>Metrics and alerting</p>
            <a routerLink="/monitoring" class="service-link">Manage →</a>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions-section">
        <h2>Quick Actions</h2>
        <div class="actions-grid">
          <button class="action-btn" routerLink="/docker/containers/new">
            <span class="action-icon">🐳</span>
            <span>Create Container</span>
          </button>
          
          <button class="action-btn" routerLink="/servers/new">
            <span class="action-icon">🖥️</span>
            <span>Add Server</span>
          </button>
          
          <button class="action-btn" routerLink="/teams/new">
            <span class="action-icon">👥</span>
            <span>Create Team</span>
          </button>
          
          <button class="action-btn" routerLink="/ai/chat">
            <span class="action-icon">🤖</span>
            <span>AI Chat</span>
          </button>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="recent-activity-section">
        <h2>Recent Activity</h2>
        <div class="activity-list">
          <div class="activity-item">
            <div class="activity-icon">🐳</div>
            <div class="activity-content">
              <p><strong>Container started:</strong> nginx-proxy</p>
              <small>2 minutes ago</small>
            </div>
          </div>
          
          <div class="activity-item">
            <div class="activity-icon">📊</div>
            <div class="activity-content">
              <p><strong>Alert resolved:</strong> High CPU usage</p>
              <small>15 minutes ago</small>
            </div>
          </div>
          
          <div class="activity-item">
            <div class="activity-icon">👥</div>
            <div class="activity-content">
              <p><strong>Team member added:</strong> john.doe@example.com</p>
              <small>1 hour ago</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e0e0e0;
    }

    .dashboard-header h1 {
      margin: 0;
      color: #333;
      font-size: 2rem;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .stat-icon {
      font-size: 2.5rem;
      opacity: 0.8;
    }

    .stat-content h3 {
      margin: 0;
      font-size: 2rem;
      color: #333;
    }

    .stat-content p {
      margin: 0.25rem 0;
      font-weight: 600;
      color: #666;
    }

    .stat-content small {
      color: #999;
      font-size: 0.875rem;
    }

    .service-status-section,
    .quick-actions-section,
    .recent-activity-section {
      margin-bottom: 3rem;
    }

    .service-status-section h2,
    .quick-actions-section h2,
    .recent-activity-section h2 {
      margin-bottom: 1.5rem;
      color: #333;
    }

    .service-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .service-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border-left: 4px solid #ddd;
      transition: all 0.3s ease;
    }

    .service-card.healthy {
      border-left-color: #4CAF50;
    }

    .service-card.unhealthy {
      border-left-color: #f44336;
    }

    .service-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .service-name {
      font-weight: 600;
      color: #333;
    }

    .service-status {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      background: #e0e0e0;
      color: #666;
    }

    .service-card.healthy .service-status {
      background: #e8f5e8;
      color: #4CAF50;
    }

    .service-card.unhealthy .service-status {
      background: #ffebee;
      color: #f44336;
    }

    .service-link {
      color: #2196F3;
      text-decoration: none;
      font-weight: 500;
      margin-top: 1rem;
      display: inline-block;
    }

    .service-link:hover {
      text-decoration: underline;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .action-btn {
      background: white;
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      color: #333;
    }

    .action-btn:hover {
      border-color: #2196F3;
      background: #f8f9fa;
    }

    .action-icon {
      font-size: 2rem;
    }

    .activity-list {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #f0f0f0;
    }

    .activity-item:last-child {
      border-bottom: none;
    }

    .activity-icon {
      font-size: 1.5rem;
      opacity: 0.7;
    }

    .activity-content p {
      margin: 0;
      color: #333;
    }

    .activity-content small {
      color: #999;
      font-size: 0.875rem;
    }

    .btn {
      padding: 0.5rem 1rem;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      font-weight: 500;
      text-decoration: none;
      display: inline-block;
    }

    .btn-outline {
      background: transparent;
      border: 1px solid #ddd;
      color: #666;
    }

    .btn-outline:hover {
      background: #f8f9fa;
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser$: Observable<User | null>;
  dashboardStats$: Observable<DashboardStats>;

  constructor(
    private authService: AuthService,
    private dockerService: DockerService
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.dashboardStats$ = this.loadDashboardStats();
  }

  ngOnInit(): void {
    // Load initial data
  }

  logout(): void {
    this.authService.logout().subscribe();
  }

  private loadDashboardStats(): Observable<DashboardStats> {
    return forkJoin({
      containers: this.dockerService.getContainers(true).pipe(
        catchError(() => [])
      ),
      images: this.dockerService.getImages().pipe(
        catchError(() => [])
      ),
      dockerHealth: this.dockerService.ping().pipe(
        map(() => ({ status: 'UP' as const })),
        catchError(() => ({ status: 'DOWN' as const }))
      )
    }).pipe(
      map(({ containers, images, dockerHealth }) => ({
        containers: {
          total: containers.length,
          running: containers.filter(c => c.status === 'running').length,
          stopped: containers.filter(c => c.status === 'exited').length
        },
        images: {
          total: images.length,
          size: this.formatBytes(images.reduce((sum, img) => sum + img.size, 0))
        },
        services: {
          docker: dockerHealth,
          gitlab: { status: 'UP' as const }, // Mock for now
          ai: { status: 'UP' as const }, // Mock for now
          monitoring: { status: 'UP' as const } // Mock for now
        }
      }))
    );
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

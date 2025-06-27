import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { 
  DockerService,
  ContainerInfo,
  ContainerCreateRequest,
  ContainerStatus
} from '../../core';

@Component({
  selector: 'app-docker-containers',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="containers-page">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <h1>Docker Containers</h1>
          <div class="header-actions">
            <button class="btn btn-primary" (click)="showCreateModal = true">
              <span class="icon">+</span>
              Create Container
            </button>
            <button class="btn btn-secondary" (click)="refreshContainers()">
              <span class="icon">🔄</span>
              Refresh
            </button>
          </div>
        </div>
        
        <!-- Filters -->
        <div class="filters">
          <div class="filter-group">
            <label>Status:</label>
            <select [(ngModel)]="statusFilter" (change)="applyFilters()">
              <option value="">All</option>
              <option value="running">Running</option>
              <option value="exited">Stopped</option>
              <option value="paused">Paused</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>Search:</label>
            <input type="text" 
                   [(ngModel)]="searchFilter" 
                   (input)="applyFilters()"
                   placeholder="Search containers...">
          </div>
        </div>
      </div>

      <!-- Containers List -->
      <div class="containers-grid" *ngIf="filteredContainers$ | async as containers">
        <div class="container-card" 
             *ngFor="let container of containers"
             [class.running]="container.status === 'running'"
             [class.stopped]="container.status === 'exited'"
             [class.paused]="container.status === 'paused'">
          
          <div class="container-header">
            <div class="container-info">
              <h3>{{ container.name }}</h3>
              <span class="container-id">{{ container.containerId.substring(0, 12) }}</span>
            </div>
            <div class="container-status" [attr.data-status]="container.status">
              {{ container.status | titlecase }}
            </div>
          </div>

          <div class="container-details">
            <div class="detail-row">
              <span class="label">Image:</span>
              <span class="value">{{ container.image }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Created:</span>
              <span class="value">{{ container.createdAt | date:'short' }}</span>
            </div>
            <div class="detail-row" *ngIf="container.ports.length > 0">
              <span class="label">Ports:</span>
              <span class="value">
                <span *ngFor="let port of container.ports; let last = last">
                  {{ port.hostPort }}:{{ port.containerPort }}{{ !last ? ', ' : '' }}
                </span>
              </span>
            </div>
          </div>

          <div class="container-actions">
            <button class="action-btn start" 
                    *ngIf="container.status !== 'running'"
                    (click)="startContainer(container.id)"
                    [disabled]="isLoading">
              ▶️ Start
            </button>
            
            <button class="action-btn stop" 
                    *ngIf="container.status === 'running'"
                    (click)="stopContainer(container.id)"
                    [disabled]="isLoading">
              ⏹️ Stop
            </button>
            
            <button class="action-btn restart" 
                    *ngIf="container.status === 'running'"
                    (click)="restartContainer(container.id)"
                    [disabled]="isLoading">
              🔄 Restart
            </button>
            
            <button class="action-btn logs" 
                    (click)="viewLogs(container.id)">
              📋 Logs
            </button>
            
            <button class="action-btn terminal" 
                    *ngIf="container.status === 'running'"
                    (click)="openTerminal(container.id)">
              💻 Terminal
            </button>
            
            <button class="action-btn delete" 
                    (click)="deleteContainer(container.id)"
                    [disabled]="isLoading">
              🗑️ Delete
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div class="empty-state" *ngIf="containers.length === 0">
          <div class="empty-icon">🐳</div>
          <h3>No containers found</h3>
          <p>Create your first container to get started</p>
          <button class="btn btn-primary" (click)="showCreateModal = true">
            Create Container
          </button>
        </div>
      </div>

      <!-- Create Container Modal -->
      <div class="modal-overlay" *ngIf="showCreateModal" (click)="showCreateModal = false">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Create New Container</h2>
            <button class="close-btn" (click)="showCreateModal = false">×</button>
          </div>
          
          <form class="modal-body" (ngSubmit)="createContainer()" #createForm="ngForm">
            <div class="form-group">
              <label for="containerName">Container Name:</label>
              <input type="text" 
                     id="containerName"
                     [(ngModel)]="newContainer.name" 
                     name="containerName"
                     placeholder="my-container"
                     required>
            </div>
            
            <div class="form-group">
              <label for="containerImage">Image:</label>
              <input type="text" 
                     id="containerImage"
                     [(ngModel)]="newContainer.image" 
                     name="containerImage"
                     placeholder="nginx:latest"
                     required>
            </div>
            
            <div class="form-group">
              <label for="containerPorts">Ports (host:container):</label>
              <input type="text" 
                     id="containerPorts"
                     [(ngModel)]="portsInput" 
                     name="containerPorts"
                     placeholder="8080:80, 8443:443">
            </div>
            
            <div class="form-group">
              <label for="containerEnv">Environment Variables:</label>
              <textarea id="containerEnv"
                        [(ngModel)]="envInput" 
                        name="containerEnv"
                        placeholder="KEY1=value1&#10;KEY2=value2"
                        rows="3"></textarea>
            </div>
            
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" (click)="showCreateModal = false">
                Cancel
              </button>
              <button type="submit" 
                      class="btn btn-primary" 
                      [disabled]="!createForm.valid || isLoading">
                Create Container
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Loading Overlay -->
      <div class="loading-overlay" *ngIf="isLoading">
        <div class="spinner"></div>
        <p>{{ loadingMessage }}</p>
      </div>
    </div>
  `,
  styles: [`
    .containers-page {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .header-content h1 {
      margin: 0;
      color: #333;
    }

    .header-actions {
      display: flex;
      gap: 1rem;
    }

    .filters {
      display: flex;
      gap: 2rem;
      padding: 1rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .filter-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .filter-group label {
      font-weight: 500;
      color: #666;
    }

    .filter-group select,
    .filter-group input {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 0.875rem;
    }

    .containers-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 1.5rem;
    }

    .container-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border-left: 4px solid #ddd;
      transition: all 0.3s ease;
    }

    .container-card.running {
      border-left-color: #4CAF50;
    }

    .container-card.stopped {
      border-left-color: #f44336;
    }

    .container-card.paused {
      border-left-color: #ff9800;
    }

    .container-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .container-info h3 {
      margin: 0;
      color: #333;
      font-size: 1.125rem;
    }

    .container-id {
      font-family: monospace;
      font-size: 0.75rem;
      color: #999;
    }

    .container-status {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .container-status[data-status="running"] {
      background: #e8f5e8;
      color: #4CAF50;
    }

    .container-status[data-status="exited"] {
      background: #ffebee;
      color: #f44336;
    }

    .container-status[data-status="paused"] {
      background: #fff3e0;
      color: #ff9800;
    }

    .container-details {
      margin-bottom: 1.5rem;
    }

    .detail-row {
      display: flex;
      margin-bottom: 0.5rem;
    }

    .detail-row .label {
      font-weight: 500;
      color: #666;
      min-width: 80px;
    }

    .detail-row .value {
      color: #333;
      word-break: break-all;
    }

    .container-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .action-btn {
      padding: 0.5rem 0.75rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      background: white;
      cursor: pointer;
      font-size: 0.75rem;
      transition: all 0.2s ease;
    }

    .action-btn:hover:not(:disabled) {
      background: #f8f9fa;
    }

    .action-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .action-btn.start:hover {
      background: #e8f5e8;
      border-color: #4CAF50;
    }

    .action-btn.stop:hover {
      background: #ffebee;
      border-color: #f44336;
    }

    .action-btn.delete:hover {
      background: #ffebee;
      border-color: #f44336;
      color: #f44336;
    }

    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 4rem 2rem;
      color: #666;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .empty-state h3 {
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal {
      background: white;
      border-radius: 12px;
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #e0e0e0;
    }

    .modal-header h2 {
      margin: 0;
      color: #333;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #999;
    }

    .modal-body {
      padding: 1.5rem;
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

    .form-group input,
    .form-group textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 0.875rem;
    }

    .form-group input:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #2196F3;
      box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s ease;
    }

    .btn-primary {
      background: #2196F3;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #1976D2;
    }

    .btn-secondary {
      background: #f8f9fa;
      color: #666;
      border: 1px solid #ddd;
    }

    .btn-secondary:hover:not(:disabled) {
      background: #e9ecef;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255,255,255,0.9);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 2000;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #2196F3;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .icon {
      font-size: 1rem;
    }
  `]
})
export class DockerContainersComponent implements OnInit {
  containers$ = new BehaviorSubject<ContainerInfo[]>([]);
  filteredContainers$: Observable<ContainerInfo[]>;
  
  statusFilter = '';
  searchFilter = '';
  showCreateModal = false;
  isLoading = false;
  loadingMessage = '';

  newContainer: Partial<ContainerCreateRequest> = {
    name: '',
    image: ''
  };
  portsInput = '';
  envInput = '';

  constructor(private dockerService: DockerService) {
    this.filteredContainers$ = this.containers$.pipe(
      map(containers => this.filterContainers(containers))
    );
  }

  ngOnInit(): void {
    this.loadContainers();
  }

  loadContainers(): void {
    this.isLoading = true;
    this.loadingMessage = 'Loading containers...';
    
    this.dockerService.getContainers(true).subscribe({
      next: (containers) => {
        this.containers$.next(containers);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load containers:', error);
        this.isLoading = false;
      }
    });
  }

  refreshContainers(): void {
    this.loadContainers();
  }

  applyFilters(): void {
    // Trigger filter update
    this.containers$.next(this.containers$.value);
  }

  private filterContainers(containers: ContainerInfo[]): ContainerInfo[] {
    return containers.filter(container => {
      const matchesStatus = !this.statusFilter || container.status === this.statusFilter;
      const matchesSearch = !this.searchFilter || 
        container.name.toLowerCase().includes(this.searchFilter.toLowerCase()) ||
        container.image.toLowerCase().includes(this.searchFilter.toLowerCase());
      
      return matchesStatus && matchesSearch;
    });
  }

  startContainer(id: string): void {
    this.isLoading = true;
    this.loadingMessage = 'Starting container...';
    
    this.dockerService.startContainer(id).subscribe({
      next: () => {
        this.loadContainers();
      },
      error: (error) => {
        console.error('Failed to start container:', error);
        this.isLoading = false;
      }
    });
  }

  stopContainer(id: string): void {
    this.isLoading = true;
    this.loadingMessage = 'Stopping container...';
    
    this.dockerService.stopContainer(id).subscribe({
      next: () => {
        this.loadContainers();
      },
      error: (error) => {
        console.error('Failed to stop container:', error);
        this.isLoading = false;
      }
    });
  }

  restartContainer(id: string): void {
    this.isLoading = true;
    this.loadingMessage = 'Restarting container...';
    
    this.dockerService.restartContainer(id).subscribe({
      next: () => {
        this.loadContainers();
      },
      error: (error) => {
        console.error('Failed to restart container:', error);
        this.isLoading = false;
      }
    });
  }

  deleteContainer(id: string): void {
    if (!confirm('Are you sure you want to delete this container?')) {
      return;
    }

    this.isLoading = true;
    this.loadingMessage = 'Deleting container...';
    
    this.dockerService.removeContainer(id, true).subscribe({
      next: () => {
        this.loadContainers();
      },
      error: (error) => {
        console.error('Failed to delete container:', error);
        this.isLoading = false;
      }
    });
  }

  viewLogs(id: string): void {
    // Navigate to logs view
    console.log('View logs for container:', id);
  }

  openTerminal(id: string): void {
    // Open terminal for container
    console.log('Open terminal for container:', id);
  }

  createContainer(): void {
    if (!this.newContainer.name || !this.newContainer.image) {
      return;
    }

    this.isLoading = true;
    this.loadingMessage = 'Creating container...';

    const containerRequest: ContainerCreateRequest = {
      name: this.newContainer.name,
      image: this.newContainer.image,
      ports: this.parsePorts(this.portsInput),
      environment: this.parseEnvironment(this.envInput)
    };

    this.dockerService.createContainer(containerRequest).subscribe({
      next: () => {
        this.showCreateModal = false;
        this.resetCreateForm();
        this.loadContainers();
      },
      error: (error) => {
        console.error('Failed to create container:', error);
        this.isLoading = false;
      }
    });
  }

  private parsePorts(portsInput: string): any[] {
    if (!portsInput.trim()) return [];
    
    return portsInput.split(',').map(port => {
      const [hostPort, containerPort] = port.trim().split(':');
      return {
        hostPort: parseInt(hostPort),
        containerPort: parseInt(containerPort),
        protocol: 'tcp'
      };
    }).filter(port => !isNaN(port.hostPort) && !isNaN(port.containerPort));
  }

  private parseEnvironment(envInput: string): Record<string, string> {
    if (!envInput.trim()) return {};
    
    const env: Record<string, string> = {};
    envInput.split('\n').forEach(line => {
      const [key, value] = line.trim().split('=');
      if (key && value) {
        env[key] = value;
      }
    });
    return env;
  }

  private resetCreateForm(): void {
    this.newContainer = {
      name: '',
      image: ''
    };
    this.portsInput = '';
    this.envInput = '';
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators'; // Removed tap as it's not used here

import { DockerService } from './services/docker.service';
import { DockerContainer } from './models/docker-container.model';
import { DockerImage } from './models/docker-image.model';
import { DockerRegistry } from './models/docker-registry.model';

@Component({
  selector: 'app-docker-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatToolbarModule, MatCardModule, MatButtonModule,
    MatIconModule, MatListModule, MatTabsModule, MatProgressSpinnerModule,
    MatChipsModule, DatePipe
  ],
  templateUrl: './docker-dashboard.component.html',
  styleUrls: ['./docker-dashboard.component.scss']
})
export class DockerDashboardComponent implements OnInit {
  private dockerService = inject(DockerService);

  containers$: Observable<DockerContainer[]> = of([]);
  images$: Observable<DockerImage[]> = of([]);
  registries$: Observable<DockerRegistry[]> = of([]);

  isLoadingContainers = false;
  isLoadingImages = false;
  isLoadingRegistries = false;

  errorContainers: string | null = null;
  errorImages: string | null = null;
  errorRegistries: string | null = null;

  constructor() { }

  ngOnInit(): void {
    this.loadContainers();
    this.loadImages();
    this.loadRegistries();
  }

  loadContainers(): void {
    this.isLoadingContainers = true;
    this.errorContainers = null;
    this.containers$ = this.dockerService.getContainers().pipe(
      finalize(() => this.isLoadingContainers = false),
      catchError(err => {
        this.errorContainers = 'Failed to load containers.';
        console.error(err);
        return of([]);
      })
    );
  }

  loadImages(): void {
    this.isLoadingImages = true;
    this.errorImages = null;
    this.images$ = this.dockerService.getImages().pipe(
      finalize(() => this.isLoadingImages = false),
      catchError(err => {
        this.errorImages = 'Failed to load images.';
        console.error(err);
        return of([]);
      })
    );
  }

  loadRegistries(): void {
    this.isLoadingRegistries = true;
    this.errorRegistries = null;
    this.registries$ = this.dockerService.getRegistries().pipe(
      finalize(() => this.isLoadingRegistries = false),
      catchError(err => {
        this.errorRegistries = 'Failed to load registries.';
        console.error(err);
        return of([]);
      })
    );
  }

  startContainer(containerId: string) { console.log(`Start container: ${containerId}`); }
  stopContainer(containerId: string) { console.log(`Stop container: ${containerId}`); }
  viewContainerLogs(containerId: string) { console.log(`View logs for container: ${containerId}`); }
  removeContainer(containerId: string) { console.log(`Remove container: ${containerId}`); }
  pullImage(imageName: string) { console.log(`Pull image: ${imageName}`); }
  removeImage(imageId: string) { console.log(`Remove image: ${imageId}`); }
  connectRegistry(registryId: string) { console.log(`Connect to registry: ${registryId}`); }
  addRegistry() { console.log('Add new registry'); }
}

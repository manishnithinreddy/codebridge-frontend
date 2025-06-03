import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiService } from '../../../core/http/api.service';
import { DockerContainer } from '../models/docker-container.model';
import { DockerImage } from '../models/docker-image.model';
import { DockerRegistry } from '../models/docker-registry.model';

@Injectable({
  providedIn: 'root'
})
export class DockerService {
  private apiService = inject(ApiService);
  private dockerServiceBasePath = '/docker-service/api';

  constructor() { }

  getContainers(): Observable<DockerContainer[]> {
    console.warn('DockerService: Using mock container data.');
    const mockData: DockerContainer[] = [
      { id: 'c1', name: 'live-web-app', image: 'nginx:stable', status: 'running', ports: [{privatePort: 80, publicPort: 8080, type: 'tcp'}], createdAt: new Date().toISOString() },
      { id: 'c2', name: 'archived-db', image: 'postgres:12-alpine', status: 'exited', ports: [{privatePort: 5432, publicPort: 5432, type: 'tcp'}], createdAt: new Date(Date.now() - 86400000).toISOString() },
      { id: 'c3', name: 'processing-worker', image: 'custom/worker:latest', status: 'created', createdAt: new Date(Date.now() - 3600000).toISOString() },
    ];
    return of(mockData).pipe(tap(d => console.log('Mock containers:', d)), catchError(() => of([])));
  }

  getImages(): Observable<DockerImage[]> {
    console.warn('DockerService: Using mock image data.');
    const mockData: DockerImage[] = [
      { id: 'img1', repository: 'nginx', tag: 'stable', size: '135MB', createdAt: new Date().toISOString() },
      { id: 'img2', repository: 'postgres', tag: '12-alpine', size: '80MB', createdAt: new Date(Date.now() - 86400000*2).toISOString() },
      { id: 'img3', repository: 'custom/worker', tag: 'latest', size: '210MB', createdAt: new Date(Date.now() - 3600000*5).toISOString() },
      { id: 'img4', repository: '<none>', tag: '<none>', size: '50MB', createdAt: new Date(Date.now() - 3600000*10).toISOString() },
    ];
    return of(mockData).pipe(tap(d => console.log('Mock images:', d)), catchError(() => of([])));
  }

  getRegistries(): Observable<DockerRegistry[]> {
    console.warn('DockerService: Using mock registry data.');
    const mockData: DockerRegistry[] = [
      { id: 'reg1', name: 'Docker Hub (Default)', url: 'https://hub.docker.com', isConnected: true },
      { id: 'reg2', name: 'GHCR - MyOrg', url: 'ghcr.io/my-organization', username: 'oauth2accesstoken', isConnected: true },
      { id: 'reg3', name: 'Private ECR DE', url: '123456789012.dkr.ecr.eu-central-1.amazonaws.com', isConnected: false },
    ];
    return of(mockData).pipe(tap(d => console.log('Mock registries:', d)), catchError(() => of([])));
  }
}

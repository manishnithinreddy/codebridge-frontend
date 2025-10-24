import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import {
  ContainerInfo,
  ContainerCreateRequest,
  ContainerUpdateRequest,
  ContainerExecRequest,
  ContainerExecResponse,
  ContainerLogs,
  ContainerStats,
  DockerImage,
  DockerRegistry,
  DockerContext,
  ImageBuildRequest,
  ImageBuildResponse,
  RegistryAuthConfig,
  PaginatedResponse
} from '../models';

/**
 * Docker service for container and image management
 */
@Injectable({
  providedIn: 'root'
})
export class DockerService extends BaseApiService {
  protected override readonly baseUrl = '/api/docker';

  // Container Management
  
  /**
   * Get all containers
   */
  getContainers(showAll: boolean = false): Observable<ContainerInfo[]> {
    const params = this.buildParams({ showAll });
    return this.get<ContainerInfo[]>(
      '/containers',
      params
    );
  }

  /**
   * Get container by ID
   */
  getContainer(id: string): Observable<ContainerInfo> {
    return this.get<ContainerInfo>(
      `/containers/${id}`
    );
  }

  /**
   * Create a new container
   */
  createContainer(request: ContainerCreateRequest): Observable<ContainerInfo> {
    return this.post<ContainerInfo>(
      '/containers',
      request
    );
  }

  /**
   * Update container configuration
   */
  updateContainer(id: string, request: ContainerUpdateRequest): Observable<ContainerInfo> {
    return this.put<ContainerInfo>(
      `/containers/${id}`),
      request
    );
  }

  /**
   * Start a container
   */
  startContainer(id: string): Observable<void> {
    return this.post<void>(
      `/containers/${id}/start`),
      {}
    );
  }

  /**
   * Stop a container
   */
  stopContainer(id: string, timeout?: number): Observable<void> {
    const params = timeout ? this.buildParams({ timeout }) : undefined;
    return this.post<void>(
      `/containers/${id}/stop`),
      {},
      undefined
    );
  }

  /**
   * Restart a container
   */
  restartContainer(id: string, timeout?: number): Observable<void> {
    const params = timeout ? this.buildParams({ timeout }) : undefined;
    return this.post<void>(
      `/containers/${id}/restart`),
      {}
    );
  }

  /**
   * Pause a container
   */
  pauseContainer(id: string): Observable<void> {
    return this.post<void>(
      `/containers/${id}/pause`),
      {}
    );
  }

  /**
   * Unpause a container
   */
  unpauseContainer(id: string): Observable<void> {
    return this.post<void>(
      `/containers/${id}/unpause`),
      {}
    );
  }

  /**
   * Remove a container
   */
  removeContainer(id: string, force: boolean = false, removeVolumes: boolean = false): Observable<void> {
    const params = this.buildParams({ force, removeVolumes });
    return this.delete<void>(
      `/containers/${id}?${params.toString()}`)
    );
  }

  /**
   * Execute command in container
   */
  execContainer(id: string, request: ContainerExecRequest): Observable<ContainerExecResponse> {
    return this.post<ContainerExecResponse>(
      `/containers/${id}/exec`),
      request
    );
  }

  /**
   * Get container logs
   */
  getContainerLogs(
    id: string, 
    follow: boolean = false, 
    tail: number = 100,
    since?: string,
    until?: string
  ): Observable<ContainerLogs> {
    const params = this.buildParams({ follow, tail, since, until });
    return this.get<ContainerLogs>(
      `/containers/${id}/logs`),
      params
    );
  }

  /**
   * Get container statistics
   */
  getContainerStats(id: string, stream: boolean = false): Observable<ContainerStats> {
    const params = this.buildParams({ stream });
    return this.get<ContainerStats>(
      `/containers/${id}/stats`),
      params
    );
  }

  /**
   * Rename container
   */
  renameContainer(id: string, newName: string): Observable<void> {
    return this.post<void>(
      `/containers/${id}/rename`),
      { name: newName }
    );
  }

  // Image Management

  /**
   * Get all images
   */
  getImages(showAll: boolean = false): Observable<DockerImage[]> {
    const params = this.buildParams({ showAll });
    return this.get<DockerImage[]>(
      '/images',
      params
    );
  }

  /**
   * Get image by ID
   */
  getImage(id: string): Observable<DockerImage> {
    return this.get<DockerImage>(
      `/images/${id}`)
    );
  }

  /**
   * Pull image from registry
   */
  pullImage(imageName: string, tag: string = 'latest'): Observable<void> {
    return this.post<void>(
      '/images/pull',
      { image: imageName, tag }
    );
  }

  /**
   * Push image to registry
   */
  pushImage(imageName: string, tag: string = 'latest'): Observable<void> {
    return this.post<void>(
      '/images/push',
      { image: imageName, tag }
    );
  }

  /**
   * Build image from Dockerfile
   */
  buildImage(request: ImageBuildRequest): Observable<ImageBuildResponse> {
    return this.post<ImageBuildResponse>(
      '/images/build',
      request
    );
  }

  /**
   * Remove image
   */
  removeImage(id: string, force: boolean = false, noPrune: boolean = false): Observable<void> {
    const params = this.buildParams({ force, noPrune });
    return this.delete<void>(
      `/images/${id}?${params.toString()}`)
    );
  }

  /**
   * Tag image
   */
  tagImage(id: string, repository: string, tag: string): Observable<void> {
    return this.post<void>(
      `/images/${id}/tag`),
      { repository, tag }
    );
  }

  /**
   * Search images in registry
   */
  searchImages(term: string, limit: number = 25): Observable<any[]> {
    const params = this.buildParams({ term, limit });
    return this.get<any[]>(
      '/images/search',
      params
    );
  }

  /**
   * Get image history
   */
  getImageHistory(id: string): Observable<any[]> {
    return this.get<any[]>(
      `/images/${id}/history`)
    );
  }

  // Registry Management

  /**
   * Get all registries
   */
  getRegistries(): Observable<DockerRegistry[]> {
    return this.get<DockerRegistry[]>(
      '/registries')
    );
  }

  /**
   * Get registry by ID
   */
  getRegistry(id: string): Observable<DockerRegistry> {
    return this.get<DockerRegistry>(
      `/registries/${id}`)
    );
  }

  /**
   * Create registry
   */
  createRegistry(registry: Omit<DockerRegistry, 'id' | 'createdAt' | 'updatedAt'>): Observable<DockerRegistry> {
    return this.post<DockerRegistry>(
      '/registries',
      registry
    );
  }

  /**
   * Update registry
   */
  updateRegistry(id: string, registry: Partial<DockerRegistry>): Observable<DockerRegistry> {
    return this.put<DockerRegistry>(
      `/registries/${id}`),
      registry
    );
  }

  /**
   * Delete registry
   */
  deleteRegistry(id: string): Observable<void> {
    return this.delete<void>(
      `/registries/${id}`)
    );
  }

  /**
   * Test registry connection
   */
  testRegistry(id: string): Observable<{ success: boolean; message?: string }> {
    return this.post<{ success: boolean; message?: string }>(
      `/registries/${id}/test`),
      {}
    );
  }

  /**
   * Authenticate with registry
   */
  authenticateRegistry(authConfig: RegistryAuthConfig): Observable<{ success: boolean; token?: string }> {
    return this.post<{ success: boolean; token?: string }>(
      '/auth',
      authConfig
    );
  }

  // Context Management

  /**
   * Get all Docker contexts
   */
  getContexts(): Observable<DockerContext[]> {
    return this.get<DockerContext[]>(
      '/contexts')
    );
  }

  /**
   * Get current Docker context
   */
  getCurrentContext(): Observable<DockerContext> {
    return this.get<DockerContext>(
      '/contexts/current')
    );
  }

  /**
   * Create Docker context
   */
  createContext(context: Omit<DockerContext, 'id' | 'createdAt' | 'updatedAt'>): Observable<DockerContext> {
    return this.post<DockerContext>(
      '/contexts',
      context
    );
  }

  /**
   * Update Docker context
   */
  updateContext(id: string, context: Partial<DockerContext>): Observable<DockerContext> {
    return this.put<DockerContext>(
      `/contexts/${id}`),
      context
    );
  }

  /**
   * Delete Docker context
   */
  deleteContext(id: string): Observable<void> {
    return this.delete<void>(
      `/contexts/${id}`)
    );
  }

  /**
   * Switch to Docker context
   */
  switchContext(id: string): Observable<void> {
    return this.post<void>(
      `/contexts/${id}/use`),
      {}
    );
  }

  // System Operations

  /**
   * Get Docker system information
   */
  getSystemInfo(): Observable<any> {
    return this.get<any>(
      '/system/info')
    );
  }

  /**
   * Get Docker version
   */
  getVersion(): Observable<any> {
    return this.get<any>(
      '/system/version')
    );
  }

  /**
   * Ping Docker daemon
   */
  ping(): Observable<{ success: boolean }> {
    return this.get<{ success: boolean }>(
      '/system/ping')
    );
  }

  /**
   * Get Docker events
   */
  getEvents(since?: string, until?: string, filters?: Record<string, string[]>): Observable<any[]> {
    const params = this.buildParams({ since, until, filters: JSON.stringify(filters) });
    return this.get<any[]>(
      '/system/events',
      params
    );
  }

  /**
   * Prune system (remove unused data)
   */
  pruneSystem(): Observable<{ containersDeleted: number; imagesDeleted: number; spaceReclaimed: number }> {
    return this.post<{ containersDeleted: number; imagesDeleted: number; spaceReclaimed: number }>(
      '/system/prune',
      {}
    );
  }

  /**
   * Get disk usage
   */
  getDiskUsage(): Observable<any> {
    return this.get<any>(
      '/system/df')
    );
  }
}

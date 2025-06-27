import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ApiService } from '../../../core/http/api.service';
import { Server } from '../models/server.model';
@Injectable({ providedIn: 'root' })
export class ServerService {
  private apiService = inject(ApiService);
  private serverServiceBasePath = '/server-service/api/servers';
  constructor() { }
  getServers(): Observable<Server[]> {
    console.warn('ServerService: Using mock server data.');
    const mockServers: Server[] = [
      { id: '1', name: 'Production Server Alpha (Mock)', status: 'Online', hostname: '192.168.1.101', os: 'Ubuntu 22.04 LTS' },
      { id: '2', name: 'Staging Server Beta (Mock)', status: 'Offline', hostname: '192.168.1.102', os: 'CentOS Stream 8' },
      { id: '3', name: 'Development Server Gamma (Mock)', status: 'Online', hostname: '192.168.1.103', os: 'Debian 12' },
      { id: '4', name: 'Test Server Delta (Mock)', status: 'Unknown', hostname: '10.0.0.55', os: 'Rocky Linux 9' }
    ];
    return of(mockServers).pipe(
        tap(data => console.log('Mock servers fetched:', data)),
        catchError(err => { console.error('Error fetching mock servers:', err); return of([]); })
    );
  }
  getServerById(id: string): Observable<Server | undefined> {
    console.warn(`ServerService: Using mock server data for getServerById(${id}).`);
    return this.getServers().pipe(map(servers => servers.find(server => server.id === id)));
  }
}

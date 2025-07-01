import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { Session, SessionRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SessionService extends BaseApiService {
  protected override readonly baseUrl = '/session';

  /**
   * Create a new session
   */
  createSession(request: SessionRequest): Observable<Session> {
    return this.post<Session>(`${this.baseUrl}`, request);
  }

  /**
   * Get session by ID
   */
  getSession(sessionId: string): Observable<Session> {
    return this.get<Session>(`${this.baseUrl}/${sessionId}`);
  }

  /**
   * Get all sessions
   */
  getSessions(): Observable<Session[]> {
    return this.get<Session[]>(`${this.baseUrl}`);
  }

  /**
   * Update session
   */
  updateSession(sessionId: string, session: Partial<Session>): Observable<Session> {
    return this.put<Session>(`${this.baseUrl}/${sessionId}`, session);
  }

  /**
   * Delete session
   */
  deleteSession(sessionId: string): Observable<void> {
    return this.delete<void>(`${this.baseUrl}/${sessionId}`);
  }
}

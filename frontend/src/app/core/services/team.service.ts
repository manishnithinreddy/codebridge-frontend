import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { Team, TeamMember, TeamRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TeamService extends BaseApiService {
  protected override readonly baseUrl = '/teams';

  /**
   * Get all teams
   */
  getTeams(): Observable<Team[]> {
    return this.get<Team[]>(`${this.baseUrl}`);
  }

  /**
   * Get team by ID
   */
  getTeam(teamId: string): Observable<Team> {
    return this.get<Team>(`${this.baseUrl}/${teamId}`);
  }

  /**
   * Create a new team
   */
  createTeam(request: TeamRequest): Observable<Team> {
    return this.post<Team>(`${this.baseUrl}`, request);
  }

  /**
   * Update team
   */
  updateTeam(teamId: string, team: Partial<Team>): Observable<Team> {
    return this.put<Team>(`${this.baseUrl}/${teamId}`, team);
  }

  /**
   * Delete team
   */
  deleteTeam(teamId: string): Observable<void> {
    return this.delete<void>(`${this.baseUrl}/${teamId}`);
  }

  /**
   * Get team members
   */
  getTeamMembers(teamId: string): Observable<TeamMember[]> {
    return this.get<TeamMember[]>(`${this.baseUrl}/${teamId}/members`);
  }

  /**
   * Add team member
   */
  addTeamMember(teamId: string, member: TeamMember): Observable<TeamMember> {
    return this.post<TeamMember>(`${this.baseUrl}/${teamId}/members`, member);
  }

  /**
   * Remove team member
   */
  removeTeamMember(teamId: string, memberId: string): Observable<void> {
    return this.delete<void>(`${this.baseUrl}/${teamId}/members/${memberId}`);
  }
}

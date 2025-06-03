import { Injectable, inject } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiService } from '../../../core/http/api.service';
import { OrgTeam } from '../models/org-team.model';
import { OrgMember } from '../models/org-member.model';
import { OrgActivityItem } from '../models/org-activity.model';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  private apiService = inject(ApiService);
  private orgServiceBasePath = '/organization-service/api/organization';

  private mockTeams: OrgTeam[] = [
    { id: 'team1', name: 'Frontend Wizards', memberCount: 5, description: 'Crafting magical UIs.', createdAt: new Date(Date.now() - 86400000*20).toISOString() },
    { id: 'team2', name: 'Backend Titans', memberCount: 8, description: 'Building robust and scalable APIs.', createdAt: new Date(Date.now() - 86400000*30).toISOString() },
    { id: 'team3', name: 'QA Sentinels', memberCount: 3, description: 'Guardians of quality.', createdAt: new Date(Date.now() - 86400000*15).toISOString() },
  ];
  private mockMembers: OrgMember[] = [
    { id: 'user1', name: 'Eleanor Shellstrop', username: 'eleanor', email: 'eleanor@example.com', roleInOrg: 'Admin', joinedDate: new Date(Date.now() - 86400000*50).toISOString(), teams: [{id: 'team1', name: 'Frontend Wizards'}] },
    { id: 'user2', name: 'Chidi Anagonye', username: 'chidi', email: 'chidi@example.com', roleInOrg: 'Member', joinedDate: new Date(Date.now() - 86400000*45).toISOString(), teams: [{id: 'team1', name: 'Frontend Wizards'}, {id: 'team2', name: 'Backend Titans'}] },
    { id: 'user3', name: 'Tahani Al-Jamil', username: 'tahani', email: 'tahani@example.com', roleInOrg: 'Member', joinedDate: new Date(Date.now() - 86400000*60).toISOString(), teams: [{id: 'team2', name: 'Backend Titans'}] },
    { id: 'user4', name: 'Jason Mendoza', username: 'jason', email: 'jason@example.com', roleInOrg: 'Member', joinedDate: new Date(Date.now() - 86400000*30).toISOString(), teams: [{id: 'team3', name: 'QA Sentinels'}] },
  ];
  private mockActivities: OrgActivityItem[] = [
    { id: 'act1', timestamp: new Date().toISOString(), actorId: 'user1', actorName: 'Eleanor S.', action: 'team.member.added', targetType: 'member', targetId: 'user4', targetName: 'Jason M.', details: { teamName: 'QA Sentinels' } },
    { id: 'act2', timestamp: new Date(Date.now() - 3600000*2).toISOString(), actorId: 'system', actorName: 'System', action: 'billing.subscription.updated', details: { plan: 'Pro Tier' } },
    { id: 'act3', timestamp: new Date(Date.now() - 7200000*5).toISOString(), actorId: 'user2', actorName: 'Chidi A.', action: 'project.settings.changed', targetType: 'project', targetId: 'proj123', targetName: 'CodeBridge Main App' },
  ];

  constructor() { }

  getTeams(): Observable<OrgTeam[]> {
    console.warn('OrganizationService: Using mock team data.');
    return of(this.mockTeams).pipe(delay(400), tap(d => console.log('Mock teams:', d)), catchError(() => of([])));
  }

  getMembers(): Observable<OrgMember[]> {
    console.warn('OrganizationService: Using mock member data.');
    return of(this.mockMembers).pipe(delay(500), tap(d => console.log('Mock members:', d)), catchError(() => of([])));
  }

  getActivities(): Observable<OrgActivityItem[]> {
    console.warn('OrganizationService: Using mock activity data.');
    return of(this.mockActivities).pipe(delay(600), tap(d => console.log('Mock activities:', d)), catchError(() => of([])));
  }
}

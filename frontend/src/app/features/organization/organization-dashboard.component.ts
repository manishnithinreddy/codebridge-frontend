import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip'; // Added for tooltips
import { RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { OrganizationService } from './services/organization.service';
import { OrgTeam } from './models/org-team.model';
import { OrgMember } from './models/org-member.model';
import { OrgActivityItem } from './models/org-activity.model';

@Component({
  selector: 'app-organization-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatToolbarModule, MatCardModule, MatButtonModule,
    MatIconModule, MatListModule, MatTabsModule, MatFormFieldModule, MatInputModule,
    MatTableModule, MatProgressSpinnerModule, DatePipe, MatTooltipModule // Added MatTooltipModule
  ],
  templateUrl: './organization-dashboard.component.html',
  styleUrls: ['./organization-dashboard.component.scss']
})
export class OrganizationDashboardComponent implements OnInit {
  private organizationService = inject(OrganizationService);

  teams$: Observable<OrgTeam[]> = of([]);
  members$: Observable<OrgMember[]> = of([]);
  activities$: Observable<OrgActivityItem[]> = of([]);

  isLoadingTeams = false;
  isLoadingMembers = false;
  isLoadingActivities = false;

  errorTeams: string | null = null;
  errorMembers: string | null = null;
  errorActivities: string | null = null;

  memberDisplayedColumns: string[] = ['name', 'email', 'roleInOrg', 'teams', 'joinedDate', 'actions'];

  constructor() { }

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.loadTeams();
    this.loadMembers();
    this.loadActivities();
  }

  loadTeams(): void {
    this.isLoadingTeams = true;
    this.errorTeams = null;
    this.teams$ = this.organizationService.getTeams().pipe(
      finalize(() => this.isLoadingTeams = false),
      catchError(err => { this.errorTeams = 'Failed to load teams.'; console.error(err); return of([]); })
    );
  }

  loadMembers(): void {
    this.isLoadingMembers = true;
    this.errorMembers = null;
    this.members$ = this.organizationService.getMembers().pipe(
      finalize(() => this.isLoadingMembers = false),
      catchError(err => { this.errorMembers = 'Failed to load members.'; console.error(err); return of([]); })
    );
  }

  loadActivities(): void {
    this.isLoadingActivities = true;
    this.errorActivities = null;
    this.activities$ = this.organizationService.getActivities().pipe(
      finalize(() => this.isLoadingActivities = false),
      catchError(err => { this.errorActivities = 'Failed to load activities.'; console.error(err); return of([]); })
    );
  }

  inviteMember() { console.log('Invite new member'); }
  createTeam() { console.log('Create new team'); }
  viewTeamDetails(teamId: string) { console.log(`View details for team: ${teamId}`); }
  editMemberRole(memberId: string) { console.log(`Edit role for member: ${memberId}`); }
  removeMember(memberId: string) { console.log(`Remove member: ${memberId}`); }
}

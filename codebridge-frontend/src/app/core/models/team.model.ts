import { BaseEntity } from './common.model';
import { User } from './auth.model';

/**
 * Team service models
 */

export interface Team extends BaseEntity {
  name: string;
  description?: string;
  organizationId: string;
  isActive: boolean;
  members: TeamMember[];
  permissions: TeamPermission[];
  settings: TeamSettings;
  stats: TeamStats;
}

export interface TeamMember extends BaseEntity {
  teamId: string;
  userId: string;
  user: User;
  role: TeamRole;
  joinedAt: string;
  invitedBy: string;
  isActive: boolean;
  permissions: string[];
  lastActivityAt?: string;
}

export type TeamRole = 'owner' | 'admin' | 'member' | 'viewer';

export interface TeamPermission {
  resource: string;
  actions: string[];
  conditions?: Record<string, any>;
}

export interface TeamSettings {
  visibility: 'public' | 'private' | 'organization';
  allowMemberInvites: boolean;
  requireApprovalForJoin: boolean;
  defaultMemberRole: TeamRole;
  maxMembers?: number;
  allowExternalCollaboration: boolean;
  notificationSettings: NotificationSettings;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  slackIntegration?: SlackIntegration;
  webhookUrl?: string;
  notifyOnMemberJoin: boolean;
  notifyOnMemberLeave: boolean;
  notifyOnRoleChange: boolean;
  notifyOnProjectUpdate: boolean;
}

export interface SlackIntegration {
  webhookUrl: string;
  channel: string;
  username?: string;
  iconEmoji?: string;
}

export interface TeamStats {
  memberCount: number;
  activeMembers: number;
  projectCount: number;
  totalActivity: number;
  lastActivityAt?: string;
}

export interface TeamCreateRequest {
  name: string;
  description?: string;
  organizationId: string;
  settings?: Partial<TeamSettings>;
  initialMembers?: TeamMemberInvite[];
}

export interface TeamUpdateRequest {
  name?: string;
  description?: string;
  isActive?: boolean;
  settings?: Partial<TeamSettings>;
}

export interface TeamMemberInvite {
  email?: string;
  userId?: string;
  role: TeamRole;
  permissions?: string[];
  message?: string;
}

export interface TeamInvitation extends BaseEntity {
  teamId: string;
  team: Team;
  invitedEmail?: string;
  invitedUserId?: string;
  invitedBy: string;
  inviter: User;
  role: TeamRole;
  permissions: string[];
  message?: string;
  status: InvitationStatus;
  expiresAt: string;
  acceptedAt?: string;
  rejectedAt?: string;
  token: string;
}

export type InvitationStatus = 'pending' | 'accepted' | 'rejected' | 'expired' | 'cancelled';

export interface TeamInvitationResponse {
  accept: boolean;
  message?: string;
}

export interface TeamActivity extends BaseEntity {
  teamId: string;
  userId: string;
  user: User;
  activityType: TeamActivityType;
  description: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
}

export type TeamActivityType = 
  | 'member_joined' | 'member_left' | 'member_role_changed' | 'member_invited'
  | 'team_created' | 'team_updated' | 'team_deleted' | 'settings_changed'
  | 'project_created' | 'project_updated' | 'project_deleted'
  | 'permission_granted' | 'permission_revoked';

export interface TeamProject extends BaseEntity {
  teamId: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate?: string;
  endDate?: string;
  completedAt?: string;
  assignedMembers: string[]; // user IDs
  tags: string[];
  metadata?: Record<string, any>;
  progress: number; // 0-100
}

export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
export type ProjectPriority = 'low' | 'medium' | 'high' | 'critical';

export interface TeamProjectCreateRequest {
  name: string;
  description?: string;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  startDate?: string;
  endDate?: string;
  assignedMembers?: string[];
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface TeamProjectUpdateRequest {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  startDate?: string;
  endDate?: string;
  assignedMembers?: string[];
  tags?: string[];
  metadata?: Record<string, any>;
  progress?: number;
}

export interface TeamResource extends BaseEntity {
  teamId: string;
  name: string;
  type: ResourceType;
  description?: string;
  url?: string;
  content?: string;
  isPublic: boolean;
  tags: string[];
  createdBy: string;
  lastModifiedBy: string;
  accessCount: number;
  lastAccessedAt?: string;
}

export type ResourceType = 
  | 'document' | 'link' | 'file' | 'code_snippet' | 'template'
  | 'guide' | 'reference' | 'tool' | 'other';

export interface TeamResourceCreateRequest {
  name: string;
  type: ResourceType;
  description?: string;
  url?: string;
  content?: string;
  isPublic?: boolean;
  tags?: string[];
}

export interface TeamResourceUpdateRequest {
  name?: string;
  description?: string;
  url?: string;
  content?: string;
  isPublic?: boolean;
  tags?: string[];
}

export interface TeamAnalytics {
  teamId: string;
  period: 'day' | 'week' | 'month' | 'quarter' | 'year';
  startDate: string;
  endDate: string;
  memberActivity: MemberActivityStats[];
  projectProgress: ProjectProgressStats[];
  resourceUsage: ResourceUsageStats[];
  collaborationMetrics: CollaborationMetrics;
}

export interface MemberActivityStats {
  userId: string;
  username: string;
  activityCount: number;
  lastActivity: string;
  contributionScore: number;
}

export interface ProjectProgressStats {
  projectId: string;
  projectName: string;
  startProgress: number;
  endProgress: number;
  progressChange: number;
  status: ProjectStatus;
}

export interface ResourceUsageStats {
  resourceId: string;
  resourceName: string;
  accessCount: number;
  uniqueUsers: number;
  averageRating?: number;
}

export interface CollaborationMetrics {
  totalInteractions: number;
  averageResponseTime: number;
  crossFunctionalProjects: number;
  knowledgeSharingScore: number;
}

export interface TeamIntegration extends BaseEntity {
  teamId: string;
  type: IntegrationType;
  name: string;
  configuration: Record<string, any>;
  isActive: boolean;
  lastSyncAt?: string;
  syncStatus?: SyncStatus;
  errorMessage?: string;
}

export type IntegrationType = 
  | 'slack' | 'discord' | 'microsoft_teams' | 'jira' | 'trello'
  | 'github' | 'gitlab' | 'bitbucket' | 'jenkins' | 'docker'
  | 'aws' | 'azure' | 'gcp' | 'custom_webhook';

export type SyncStatus = 'success' | 'failed' | 'in_progress' | 'never_synced';

export interface TeamIntegrationCreateRequest {
  type: IntegrationType;
  name: string;
  configuration: Record<string, any>;
}

export interface TeamIntegrationUpdateRequest {
  name?: string;
  configuration?: Record<string, any>;
  isActive?: boolean;
}

export interface TeamRole extends BaseEntity {
  teamId: string;
  name: string;
  description?: string;
  permissions: string[];
  isDefault: boolean;
  isCustom: boolean;
  memberCount: number;
}

export interface TeamRoleCreateRequest {
  name: string;
  description?: string;
  permissions: string[];
  isDefault?: boolean;
}

export interface TeamRoleUpdateRequest {
  name?: string;
  description?: string;
  permissions?: string[];
  isDefault?: boolean;
}

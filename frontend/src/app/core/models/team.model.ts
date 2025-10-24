export interface Team {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  members: TeamMember[];
  projects: string[];
  createdAt: Date;
  updatedAt: Date;
  settings: TeamSettings;
}

export interface TeamMember {
  id: string;
  userId: string;
  username: string;
  email: string;
  role: TeamRole;
  joinedAt: Date;
  permissions: TeamPermission[];
  isActive: boolean;
}

export interface TeamRequest {
  name: string;
  description?: string;
  settings?: Partial<TeamSettings>;
}

export interface TeamSettings {
  isPublic: boolean;
  allowInvites: boolean;
  requireApproval: boolean;
  defaultRole: TeamRole;
  maxMembers?: number;
}

export type TeamRole = 'owner' | 'admin' | 'member' | 'viewer';

export type TeamPermission = 
  | 'read_projects'
  | 'write_projects'
  | 'delete_projects'
  | 'manage_members'
  | 'manage_settings'
  | 'invite_members';


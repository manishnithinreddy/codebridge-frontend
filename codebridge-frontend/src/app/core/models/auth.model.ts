import { BaseEntity } from './common.model';

/**
 * Authentication and authorization models
 */

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
  expiresIn: number;
}

export interface User extends BaseEntity {
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: Role[];
  organizations: Organization[];
  isActive: boolean;
  lastLoginAt?: string;
}

export interface Role extends BaseEntity {
  name: string;
  description?: string;
  permissions: Permission[];
}

export interface Permission extends BaseEntity {
  name: string;
  resource: string;
  action: string;
  description?: string;
}

export interface Organization extends BaseEntity {
  name: string;
  description?: string;
  domain?: string;
  isActive: boolean;
  members: OrganizationMember[];
}

export interface OrganizationMember {
  userId: string;
  organizationId: string;
  role: string;
  joinedAt: string;
  isActive: boolean;
}

export interface ApiKey extends BaseEntity {
  name: string;
  keyHash: string;
  userId: string;
  organizationId?: string;
  permissions: string[];
  expiresAt?: string;
  lastUsedAt?: string;
  isActive: boolean;
}

export interface ApiKeyRequest {
  name: string;
  permissions: string[];
  expiresAt?: string;
}

export interface ApiKeyResponse extends ApiKey {
  key: string; // Only returned on creation
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UserRegistrationRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  organizationId?: string;
}

export interface RbacRequest {
  userId: string;
  resource: string;
  action: string;
  organizationId?: string;
}

export interface RbacResponse {
  allowed: boolean;
  reason?: string;
}

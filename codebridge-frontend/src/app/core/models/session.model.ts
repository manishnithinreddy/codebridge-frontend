import { BaseEntity } from './common.model';

/**
 * Session service models (Go implementation)
 */

export interface Session extends BaseEntity {
  sessionId: string;
  userId: string;
  deviceId?: string;
  ipAddress: string;
  userAgent?: string;
  status: SessionStatus;
  startedAt: string;
  lastActivityAt: string;
  expiresAt: string;
  metadata?: Record<string, any>;
  location?: SessionLocation;
}

export type SessionStatus = 'active' | 'expired' | 'terminated' | 'suspended';

export interface SessionLocation {
  country?: string;
  region?: string;
  city?: string;
  timezone?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface SessionCreateRequest {
  userId: string;
  deviceId?: string;
  ipAddress: string;
  userAgent?: string;
  expiresIn?: number; // seconds
  metadata?: Record<string, any>;
}

export interface SessionUpdateRequest {
  lastActivityAt?: string;
  metadata?: Record<string, any>;
}

export interface SessionValidationRequest {
  sessionId: string;
  userId?: string;
}

export interface SessionValidationResponse {
  valid: boolean;
  session?: Session;
  reason?: string;
}

export interface SessionState {
  key: string;
  value: any;
  expiresAt?: string;
}

export interface SessionStateRequest {
  sessionId: string;
  states: SessionState[];
}

export interface SessionStateResponse {
  sessionId: string;
  states: Record<string, any>;
}

export interface SessionActivity extends BaseEntity {
  sessionId: string;
  activityType: ActivityType;
  description: string;
  ipAddress: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

export type ActivityType = 
  | 'login' | 'logout' | 'refresh' | 'access' | 'error' 
  | 'security_event' | 'state_change' | 'api_call';

export interface SessionStats {
  totalSessions: number;
  activeSessions: number;
  expiredSessions: number;
  terminatedSessions: number;
  averageSessionDuration: number;
  topLocations: LocationStats[];
  topDevices: DeviceStats[];
  activityByHour: HourlyStats[];
}

export interface LocationStats {
  location: string;
  count: number;
  percentage: number;
}

export interface DeviceStats {
  device: string;
  count: number;
  percentage: number;
}

export interface HourlyStats {
  hour: number;
  count: number;
}

export interface SessionCleanupRequest {
  olderThan?: string; // ISO date
  status?: SessionStatus[];
  batchSize?: number;
}

export interface SessionCleanupResponse {
  deletedCount: number;
  processedCount: number;
  duration: number;
}

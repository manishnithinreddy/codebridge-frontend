/**
 * Common interfaces used across all services
 */

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserEntity extends BaseEntity {
  userId: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface ErrorResponse {
  error: string;
  message: string;
  timestamp: string;
  status: number;
  path: string;
}

export interface HealthStatus {
  status: 'UP' | 'DOWN' | 'OUT_OF_SERVICE' | 'UNKNOWN';
  details?: Record<string, any>;
}

export interface KeyValuePair {
  key: string;
  value: string;
}

export interface FileInfo {
  name: string;
  path: string;
  size: number;
  lastModified: string;
  isDirectory: boolean;
}

export interface LogEntry {
  timestamp: string;
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  message: string;
  source?: string;
  metadata?: Record<string, any>;
}

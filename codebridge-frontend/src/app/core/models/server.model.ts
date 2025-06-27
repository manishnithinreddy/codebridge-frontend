import { BaseEntity, LogEntry, FileInfo } from './common.model';

/**
 * Server service models
 */

export interface Server extends BaseEntity {
  name: string;
  description?: string;
  hostname: string;
  ipAddress: string;
  port: number;
  username: string;
  authType: 'password' | 'key' | 'agent';
  password?: string;
  privateKeyId?: string;
  isActive: boolean;
  lastConnectedAt?: string;
  connectionStatus: ConnectionStatus;
  operatingSystem?: string;
  architecture?: string;
  tags: string[];
  environment: 'development' | 'staging' | 'production' | 'testing';
  region?: string;
  provider?: string;
  metadata?: Record<string, any>;
}

export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'error' | 'unknown';

export interface ServerCreateRequest {
  name: string;
  description?: string;
  hostname: string;
  ipAddress: string;
  port: number;
  username: string;
  authType: 'password' | 'key' | 'agent';
  password?: string;
  privateKeyId?: string;
  tags?: string[];
  environment: 'development' | 'staging' | 'production' | 'testing';
  region?: string;
  provider?: string;
  metadata?: Record<string, any>;
}

export interface ServerUpdateRequest {
  name?: string;
  description?: string;
  hostname?: string;
  ipAddress?: string;
  port?: number;
  username?: string;
  authType?: 'password' | 'key' | 'agent';
  password?: string;
  privateKeyId?: string;
  tags?: string[];
  environment?: 'development' | 'staging' | 'production' | 'testing';
  region?: string;
  provider?: string;
  metadata?: Record<string, any>;
}

export interface SshKey extends BaseEntity {
  name: string;
  description?: string;
  publicKey: string;
  privateKey: string;
  passphrase?: string;
  fingerprint: string;
  keyType: 'rsa' | 'dsa' | 'ecdsa' | 'ed25519';
  keySize: number;
  isDefault: boolean;
  expiresAt?: string;
}

export interface SshKeyCreateRequest {
  name: string;
  description?: string;
  publicKey: string;
  privateKey: string;
  passphrase?: string;
  keyType: 'rsa' | 'dsa' | 'ecdsa' | 'ed25519';
  keySize: number;
  isDefault?: boolean;
  expiresAt?: string;
}

export interface SshSession extends BaseEntity {
  serverId: string;
  sessionId: string;
  status: SessionStatus;
  startedAt: string;
  endedAt?: string;
  lastActivityAt: string;
  clientIp: string;
  userAgent?: string;
  terminalSize?: TerminalSize;
  environment?: Record<string, string>;
  workingDirectory?: string;
  exitCode?: number;
  bytesTransferred: number;
  commandsExecuted: number;
}

export type SessionStatus = 'active' | 'inactive' | 'terminated' | 'error';

export interface TerminalSize {
  rows: number;
  cols: number;
}

export interface SshSessionCreateRequest {
  serverId: string;
  terminalSize?: TerminalSize;
  environment?: Record<string, string>;
  workingDirectory?: string;
}

export interface RemoteCommand {
  command: string;
  workingDirectory?: string;
  environment?: Record<string, string>;
  timeout?: number;
  runAsUser?: string;
  runInBackground?: boolean;
}

export interface RemoteCommandResult {
  command: string;
  exitCode: number;
  stdout: string;
  stderr: string;
  executionTime: number;
  startedAt: string;
  finishedAt: string;
  pid?: number;
  workingDirectory?: string;
  environment?: Record<string, string>;
}

export interface RemoteOperation extends BaseEntity {
  serverId: string;
  operationType: OperationType;
  status: OperationStatus;
  command?: string;
  sourceFile?: string;
  destinationFile?: string;
  result?: RemoteCommandResult;
  error?: string;
  progress?: number;
  startedAt: string;
  finishedAt?: string;
  metadata?: Record<string, any>;
}

export type OperationType = 'command' | 'file_upload' | 'file_download' | 'file_copy' | 'file_move' | 'file_delete';
export type OperationStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface FileTransferRequest {
  serverId: string;
  operation: 'upload' | 'download';
  localPath: string;
  remotePath: string;
  preservePermissions?: boolean;
  overwrite?: boolean;
  createDirectories?: boolean;
}

export interface FileTransferProgress {
  operationId: string;
  bytesTransferred: number;
  totalBytes: number;
  percentage: number;
  speed: number;
  estimatedTimeRemaining?: number;
  currentFile?: string;
}

export interface ServerActivityLog extends BaseEntity {
  serverId: string;
  sessionId?: string;
  activityType: ActivityType;
  description: string;
  details?: Record<string, any>;
  severity: 'info' | 'warning' | 'error' | 'critical';
  source: string;
  clientIp?: string;
  userAgent?: string;
}

export type ActivityType = 
  | 'connection' | 'disconnection' | 'authentication' | 'command_execution'
  | 'file_transfer' | 'configuration_change' | 'error' | 'security_event';

export interface ServerBlacklist extends BaseEntity {
  ipAddress: string;
  reason: string;
  blockedAt: string;
  blockedBy: string;
  expiresAt?: string;
  isActive: boolean;
  attemptCount: number;
  lastAttemptAt?: string;
}

export interface ServerBlacklistCreateRequest {
  ipAddress: string;
  reason: string;
  expiresAt?: string;
}

export interface ServerUserAccess extends BaseEntity {
  serverId: string;
  userId: string;
  accessLevel: AccessLevel;
  permissions: ServerPermission[];
  grantedAt: string;
  grantedBy: string;
  expiresAt?: string;
  isActive: boolean;
  lastAccessAt?: string;
}

export type AccessLevel = 'read' | 'write' | 'admin' | 'owner';

export interface ServerPermission {
  resource: string;
  actions: string[];
  conditions?: Record<string, any>;
}

export interface TeamServerAccess extends BaseEntity {
  serverId: string;
  teamId: string;
  accessLevel: AccessLevel;
  permissions: ServerPermission[];
  grantedAt: string;
  grantedBy: string;
  expiresAt?: string;
  isActive: boolean;
}

export interface ServerStats {
  serverId: string;
  timestamp: string;
  cpu: CpuUsage;
  memory: MemoryUsage;
  disk: DiskUsage[];
  network: NetworkUsage;
  processes: ProcessInfo[];
  uptime: number;
  loadAverage: number[];
}

export interface CpuUsage {
  usage: number;
  cores: number;
  frequency: number;
  temperature?: number;
}

export interface MemoryUsage {
  total: number;
  used: number;
  free: number;
  available: number;
  cached: number;
  buffers: number;
  swapTotal: number;
  swapUsed: number;
  swapFree: number;
}

export interface DiskUsage {
  device: string;
  mountPoint: string;
  fileSystem: string;
  total: number;
  used: number;
  available: number;
  usage: number;
  inodes: number;
  inodesUsed: number;
  inodesAvailable: number;
}

export interface NetworkUsage {
  interfaces: NetworkInterface[];
  totalBytesReceived: number;
  totalBytesSent: number;
  totalPacketsReceived: number;
  totalPacketsSent: number;
}

export interface NetworkInterface {
  name: string;
  bytesReceived: number;
  bytesSent: number;
  packetsReceived: number;
  packetsSent: number;
  errors: number;
  drops: number;
  speed: number;
  duplex: string;
  mtu: number;
  ipAddresses: string[];
  macAddress: string;
  isUp: boolean;
}

export interface ProcessInfo {
  pid: number;
  name: string;
  command: string;
  user: string;
  cpuUsage: number;
  memoryUsage: number;
  startTime: string;
  status: string;
  parentPid?: number;
  children?: number[];
}

export interface LogExportRequest {
  serverId?: string;
  sessionId?: string;
  startDate: string;
  endDate: string;
  logTypes: ActivityType[];
  format: 'json' | 'csv' | 'txt';
  includeDetails?: boolean;
}

export interface LogExportResponse {
  exportId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
  fileSize?: number;
  recordCount?: number;
  createdAt: string;
  expiresAt: string;
}

export interface ServerHealth {
  serverId: string;
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  checks: HealthCheck[];
  lastCheckedAt: string;
  uptime: number;
  responseTime: number;
}

export interface HealthCheck {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  message?: string;
  details?: Record<string, any>;
  duration: number;
  checkedAt: string;
}

export interface ServerBackup extends BaseEntity {
  serverId: string;
  name: string;
  description?: string;
  backupType: 'full' | 'incremental' | 'differential';
  status: 'pending' | 'running' | 'completed' | 'failed';
  size: number;
  location: string;
  checksum: string;
  startedAt: string;
  completedAt?: string;
  retentionDays: number;
  metadata?: Record<string, any>;
}

export interface ServerBackupCreateRequest {
  serverId: string;
  name: string;
  description?: string;
  backupType: 'full' | 'incremental' | 'differential';
  location: string;
  retentionDays?: number;
  metadata?: Record<string, any>;
}

export interface ServerRestoreRequest {
  serverId: string;
  backupId: string;
  restorePoint?: string;
  overwrite?: boolean;
  preservePermissions?: boolean;
}

export interface ServerRestoreResponse {
  restoreId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  startedAt: string;
  completedAt?: string;
  error?: string;
}

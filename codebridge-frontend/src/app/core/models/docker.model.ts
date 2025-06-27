import { BaseEntity, LogEntry } from './common.model';

/**
 * Docker service models
 */

export interface ContainerInfo extends BaseEntity {
  containerId: string;
  name: string;
  image: string;
  status: ContainerStatus;
  state: string;
  ports: PortMapping[];
  networks: NetworkInfo[];
  volumes: VolumeMount[];
  environment: Record<string, string>;
  labels: Record<string, string>;
  command?: string;
  entrypoint?: string;
  workingDir?: string;
  user?: string;
  restartPolicy?: RestartPolicy;
  healthCheck?: HealthCheck;
  resources?: ResourceLimits;
}

export type ContainerStatus = 'created' | 'running' | 'paused' | 'restarting' | 'removing' | 'exited' | 'dead';

export interface PortMapping {
  containerPort: number;
  hostPort?: number;
  protocol: 'tcp' | 'udp';
  hostIp?: string;
}

export interface NetworkInfo {
  name: string;
  networkId: string;
  ipAddress?: string;
  gateway?: string;
  macAddress?: string;
}

export interface VolumeMount {
  source: string;
  destination: string;
  mode: 'ro' | 'rw';
  type: 'bind' | 'volume' | 'tmpfs';
}

export interface RestartPolicy {
  name: 'no' | 'always' | 'unless-stopped' | 'on-failure';
  maximumRetryCount?: number;
}

export interface HealthCheck {
  test: string[];
  interval?: string;
  timeout?: string;
  retries?: number;
  startPeriod?: string;
}

export interface ResourceLimits {
  memory?: number;
  memorySwap?: number;
  cpuShares?: number;
  cpuQuota?: number;
  cpuPeriod?: number;
  cpusetCpus?: string;
  cpusetMems?: string;
}

export interface DockerImage extends BaseEntity {
  imageId: string;
  repository: string;
  tag: string;
  digest?: string;
  size: number;
  architecture: string;
  os: string;
  author?: string;
  comment?: string;
  config?: ImageConfig;
  rootFs?: RootFs;
  history?: ImageHistory[];
}

export interface ImageConfig {
  hostname?: string;
  domainname?: string;
  user?: string;
  attachStdin?: boolean;
  attachStdout?: boolean;
  attachStderr?: boolean;
  exposedPorts?: Record<string, any>;
  tty?: boolean;
  openStdin?: boolean;
  stdinOnce?: boolean;
  env?: string[];
  cmd?: string[];
  healthcheck?: HealthCheck;
  argsEscaped?: boolean;
  image?: string;
  volumes?: Record<string, any>;
  workingDir?: string;
  entrypoint?: string[];
  networkDisabled?: boolean;
  macAddress?: string;
  onBuild?: string[];
  labels?: Record<string, string>;
  stopSignal?: string;
  stopTimeout?: number;
  shell?: string[];
}

export interface RootFs {
  type: string;
  diffIds?: string[];
}

export interface ImageHistory {
  created: string;
  createdBy: string;
  size: number;
  comment?: string;
  emptyLayer?: boolean;
}

export interface DockerRegistry extends BaseEntity {
  name: string;
  url: string;
  username?: string;
  email?: string;
  isDefault: boolean;
  isSecure: boolean;
  authConfig?: RegistryAuthConfig;
}

export interface RegistryAuthConfig {
  username: string;
  password: string;
  email?: string;
  serveraddress: string;
}

export interface DockerContext extends BaseEntity {
  name: string;
  description?: string;
  dockerEndpoint: string;
  kubernetesEndpoint?: string;
  isActive: boolean;
  metadata?: Record<string, any>;
}

export interface ContainerCreateRequest {
  name?: string;
  image: string;
  command?: string[];
  entrypoint?: string[];
  workingDir?: string;
  user?: string;
  environment?: Record<string, string>;
  labels?: Record<string, string>;
  ports?: PortMapping[];
  volumes?: VolumeMount[];
  networks?: string[];
  restartPolicy?: RestartPolicy;
  healthCheck?: HealthCheck;
  resources?: ResourceLimits;
  autoRemove?: boolean;
  privileged?: boolean;
  readOnly?: boolean;
}

export interface ContainerUpdateRequest {
  restartPolicy?: RestartPolicy;
  resources?: ResourceLimits;
}

export interface ContainerExecRequest {
  command: string[];
  workingDir?: string;
  user?: string;
  privileged?: boolean;
  tty?: boolean;
  attachStdin?: boolean;
  attachStdout?: boolean;
  attachStderr?: boolean;
  detach?: boolean;
  environment?: string[];
}

export interface ContainerExecResponse {
  execId: string;
  exitCode?: number;
  output?: string;
  error?: string;
}

export interface ContainerLogs {
  logs: LogEntry[];
  hasMore: boolean;
  nextCursor?: string;
}

export interface ContainerStats {
  containerId: string;
  timestamp: string;
  cpu: CpuStats;
  memory: MemoryStats;
  network: NetworkStats;
  blockIO: BlockIOStats;
}

export interface CpuStats {
  cpuUsage: number;
  systemCpuUsage: number;
  onlineCpus: number;
  throttlingData?: ThrottlingData;
}

export interface ThrottlingData {
  periods: number;
  throttledPeriods: number;
  throttledTime: number;
}

export interface MemoryStats {
  usage: number;
  maxUsage: number;
  limit: number;
  failcnt?: number;
  stats?: Record<string, number>;
}

export interface NetworkStats {
  rxBytes: number;
  rxPackets: number;
  rxErrors: number;
  rxDropped: number;
  txBytes: number;
  txPackets: number;
  txErrors: number;
  txDropped: number;
}

export interface BlockIOStats {
  ioServiceBytesRecursive?: IOServiceBytes[];
  ioServicedRecursive?: IOServiced[];
}

export interface IOServiceBytes {
  major: number;
  minor: number;
  op: string;
  value: number;
}

export interface IOServiced {
  major: number;
  minor: number;
  op: string;
  value: number;
}

export interface ImageBuildRequest {
  dockerfile: string;
  context?: string;
  tag?: string;
  buildArgs?: Record<string, string>;
  labels?: Record<string, string>;
  target?: string;
  networkMode?: string;
  platform?: string;
  pull?: boolean;
  noCache?: boolean;
  squash?: boolean;
}

export interface ImageBuildResponse {
  buildId: string;
  imageId?: string;
  logs: string[];
  success: boolean;
  error?: string;
}

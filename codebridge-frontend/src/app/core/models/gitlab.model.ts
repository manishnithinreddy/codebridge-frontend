import { BaseEntity } from './common.model';

/**
 * GitLab service models
 */

export interface GitLabAuthRequest {
  username: string;
  personalAccessToken: string;
  gitlabUrl?: string;
}

export interface GitLabAuthResponse {
  token: string;
  user: GitLabUser;
  expiresIn: number;
}

export interface GitLabUser {
  id: number;
  username: string;
  name: string;
  email: string;
  avatarUrl?: string;
  webUrl: string;
  state: 'active' | 'blocked';
  createdAt: string;
  bio?: string;
  location?: string;
  publicEmail?: string;
  skype?: string;
  linkedin?: string;
  twitter?: string;
  websiteUrl?: string;
  organization?: string;
}

export interface GitLabProject extends BaseEntity {
  gitlabId: number;
  name: string;
  nameWithNamespace: string;
  path: string;
  pathWithNamespace: string;
  description?: string;
  defaultBranch: string;
  visibility: 'private' | 'internal' | 'public';
  sshUrlToRepo: string;
  httpUrlToRepo: string;
  webUrl: string;
  readmeUrl?: string;
  tagList: string[];
  topics: string[];
  owner: GitLabUser;
  namespace: GitLabNamespace;
  forksCount: number;
  starsCount: number;
  watchersCount: number;
  openIssuesCount: number;
  publicJobs: boolean;
  archived: boolean;
  issuesEnabled: boolean;
  mergeRequestsEnabled: boolean;
  wikiEnabled: boolean;
  snippetsEnabled: boolean;
  containerRegistryEnabled: boolean;
  serviceDeskEnabled: boolean;
  canCreateMergeRequestIn: boolean;
  issuesAccessLevel: string;
  repositoryAccessLevel: string;
  mergeRequestsAccessLevel: string;
  forkingAccessLevel: string;
  wikiAccessLevel: string;
  buildsAccessLevel: string;
  snippetsAccessLevel: string;
  pagesAccessLevel: string;
  operationsAccessLevel: string;
  analyticsAccessLevel: string;
  containerRegistryAccessLevel: string;
  securityAndComplianceAccessLevel: string;
  releasesAccessLevel: string;
  environmentsAccessLevel: string;
  featureFlagsAccessLevel: string;
  infrastructureAccessLevel: string;
  monitorAccessLevel: string;
  lastActivityAt: string;
}

export interface GitLabNamespace {
  id: number;
  name: string;
  path: string;
  kind: 'user' | 'group';
  fullPath: string;
  parentId?: number;
  avatarUrl?: string;
  webUrl: string;
}

export interface GitLabBranch {
  name: string;
  merged: boolean;
  protected: boolean;
  developersCanPush: boolean;
  developersCanMerge: boolean;
  canPush: boolean;
  default: boolean;
  webUrl: string;
  commit: GitLabCommit;
}

export interface GitLabCommit {
  id: string;
  shortId: string;
  title: string;
  message: string;
  authorName: string;
  authorEmail: string;
  authoredDate: string;
  committerName: string;
  committerEmail: string;
  committedDate: string;
  createdAt: string;
  parentIds: string[];
  webUrl: string;
  stats?: CommitStats;
}

export interface CommitStats {
  additions: number;
  deletions: number;
  total: number;
}

export interface GitLabMergeRequest extends BaseEntity {
  gitlabId: number;
  iid: number;
  projectId: number;
  title: string;
  description?: string;
  state: 'opened' | 'closed' | 'locked' | 'merged';
  mergedBy?: GitLabUser;
  mergedAt?: string;
  closedBy?: GitLabUser;
  closedAt?: string;
  author: GitLabUser;
  assignees: GitLabUser[];
  assignee?: GitLabUser;
  reviewers: GitLabUser[];
  sourceBranch: string;
  targetBranch: string;
  sourceProjectId: number;
  targetProjectId: number;
  labels: string[];
  milestone?: GitLabMilestone;
  draft: boolean;
  workInProgress: boolean;
  mergeWhenPipelineSucceeds: boolean;
  mergeStatus: string;
  sha: string;
  mergeCommitSha?: string;
  squashCommitSha?: string;
  userNotesCount: number;
  upvotes: number;
  downvotes: number;
  dueDate?: string;
  confidential: boolean;
  discussionLocked: boolean;
  webUrl: string;
  timeStats: TimeStats;
  squash: boolean;
  taskCompletionStatus: TaskCompletionStatus;
  hasConflicts: boolean;
  blockingDiscussionsResolved: boolean;
  approvalsBeforeMerge?: number;
}

export interface GitLabMilestone {
  id: number;
  title: string;
  description?: string;
  state: 'active' | 'closed';
  createdAt: string;
  updatedAt: string;
  groupId?: number;
  projectId?: number;
  webUrl: string;
  dueDate?: string;
  startDate?: string;
}

export interface TimeStats {
  timeEstimate: number;
  totalTimeSpent: number;
  humanTimeEstimate?: string;
  humanTotalTimeSpent?: string;
}

export interface TaskCompletionStatus {
  count: number;
  completedCount: number;
}

export interface GitLabIssue extends BaseEntity {
  gitlabId: number;
  iid: number;
  projectId: number;
  title: string;
  description?: string;
  state: 'opened' | 'closed';
  author: GitLabUser;
  assignees: GitLabUser[];
  assignee?: GitLabUser;
  type: 'issue' | 'incident' | 'test_case';
  labels: string[];
  milestone?: GitLabMilestone;
  weight?: number;
  dueDate?: string;
  confidential: boolean;
  discussionLocked: boolean;
  issueType: string;
  severity: 'unknown' | 'low' | 'medium' | 'high' | 'critical';
  webUrl: string;
  timeStats: TimeStats;
  taskCompletionStatus: TaskCompletionStatus;
  hasTasksOrSubtasks: boolean;
  blockedByIssues: GitLabIssue[];
  closedBy?: GitLabUser;
  closedAt?: string;
  userNotesCount: number;
  mergeRequestsCount: number;
  upvotes: number;
  downvotes: number;
  epicIssueId?: number;
  epic?: GitLabEpic;
}

export interface GitLabEpic {
  id: number;
  iid: number;
  title: string;
  description?: string;
  state: 'opened' | 'closed';
  webUrl: string;
  author: GitLabUser;
  labels: string[];
  startDate?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GitLabPipeline extends BaseEntity {
  gitlabId: number;
  projectId: number;
  status: PipelineStatus;
  ref: string;
  sha: string;
  beforeSha?: string;
  tag: boolean;
  yamlErrors?: string;
  user: GitLabUser;
  source: string;
  duration?: number;
  queuedDuration?: number;
  coverage?: string;
  webUrl: string;
  detailedStatus: DetailedStatus;
}

export type PipelineStatus = 
  | 'created' | 'waiting_for_resource' | 'preparing' | 'pending'
  | 'running' | 'success' | 'failed' | 'canceled' | 'skipped'
  | 'manual' | 'scheduled';

export interface DetailedStatus {
  icon: string;
  text: string;
  label: string;
  group: string;
  tooltip: string;
  hasDetails: boolean;
  detailsPath: string;
  illustration?: any;
  favicon: string;
}

export interface GitLabJob extends BaseEntity {
  gitlabId: number;
  status: JobStatus;
  stage: string;
  name: string;
  ref: string;
  tag: boolean;
  coverage?: string;
  allowFailure: boolean;
  duration?: number;
  queuedDuration?: number;
  user: GitLabUser;
  commit: GitLabCommit;
  pipeline: GitLabPipeline;
  webUrl: string;
  artifacts: JobArtifact[];
  runner?: GitLabRunner;
  artifactsExpireAt?: string;
  tagList: string[];
  startedAt?: string;
  finishedAt?: string;
  erasedAt?: string;
  failureReason?: string;
}

export type JobStatus = 
  | 'created' | 'pending' | 'running' | 'success' 
  | 'failed' | 'canceled' | 'skipped' | 'manual';

export interface JobArtifact {
  fileType: string;
  size: number;
  filename: string;
  fileFormat?: string;
}

export interface GitLabRunner {
  id: number;
  description: string;
  ipAddress: string;
  active: boolean;
  paused: boolean;
  isShared: boolean;
  runnerType: string;
  name: string;
  online: boolean;
  status: string;
}

export interface GitProvider {
  id: string;
  name: string;
  type: 'gitlab' | 'github' | 'bitbucket';
  baseUrl: string;
  isDefault: boolean;
  configuration: Record<string, any>;
}

export interface SharedStash extends BaseEntity {
  name: string;
  description?: string;
  content: string;
  language?: string;
  isPublic: boolean;
  tags: string[];
  author: GitLabUser;
  forks: number;
  stars: number;
  views: number;
  expiresAt?: string;
}

export interface GitLabWebhook extends BaseEntity {
  gitlabId: number;
  url: string;
  projectId?: number;
  groupId?: number;
  pushEvents: boolean;
  issuesEvents: boolean;
  confidentialIssuesEvents: boolean;
  mergeRequestsEvents: boolean;
  tagPushEvents: boolean;
  noteEvents: boolean;
  jobEvents: boolean;
  pipelineEvents: boolean;
  wikiPageEvents: boolean;
  deploymentEvents: boolean;
  releasesEvents: boolean;
  subgroupEvents: boolean;
  memberEvents: boolean;
  pushEventsBranchFilter?: string;
  enableSslVerification: boolean;
  token?: string;
  customWebhookTemplate?: string;
}

export interface GitLabVariable extends BaseEntity {
  key: string;
  value: string;
  variableType: 'env_var' | 'file';
  protected: boolean;
  masked: boolean;
  raw: boolean;
  environmentScope: string;
  description?: string;
}

export interface GitLabDeployment extends BaseEntity {
  gitlabId: number;
  iid: number;
  ref: string;
  sha: string;
  status: DeploymentStatus;
  environment: GitLabEnvironment;
  deployable?: GitLabJob;
  user: GitLabUser;
  deployedAt?: string;
}

export type DeploymentStatus = 'created' | 'running' | 'success' | 'failed' | 'canceled' | 'blocked';

export interface GitLabEnvironment {
  id: number;
  name: string;
  slug: string;
  externalUrl?: string;
  state: 'available' | 'stopped';
  tier: 'production' | 'staging' | 'testing' | 'development' | 'other';
}

export interface GitLabRelease extends BaseEntity {
  gitlabId: string;
  name: string;
  tagName: string;
  description?: string;
  descriptionHtml?: string;
  releasedAt: string;
  author: GitLabUser;
  commit: GitLabCommit;
  milestones: GitLabMilestone[];
  commitPath: string;
  tagPath: string;
  evidenceSha?: string;
  assets: ReleaseAssets;
  upcomingRelease: boolean;
}

export interface ReleaseAssets {
  count: number;
  sources: ReleaseSource[];
  links: ReleaseLink[];
  evidenceFilePath?: string;
}

export interface ReleaseSource {
  format: string;
  url: string;
}

export interface ReleaseLink {
  id: number;
  name: string;
  url: string;
  directAssetUrl?: string;
  linkType?: 'other' | 'runbook' | 'image' | 'package';
  external: boolean;
}

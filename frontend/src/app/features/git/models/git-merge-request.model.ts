export interface GitMergeRequest {
  id: string | number;
  iid?: number;
  title: string;
  description?: string;
  sourceBranch: string;
  targetBranch: string;
  status: 'open' | 'closed' | 'merged' | 'locked';
  authorUsername: string;
  assigneeUsername?: string;
  createdAt: string;
  updatedAt?: string;
  webUrl?: string;
}

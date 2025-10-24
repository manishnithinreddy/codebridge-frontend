export interface GitRepository {
  id: string;
  name: string;
  defaultBranch: string;
  httpUrl: string;
  sshUrl?: string;
  webUrl?: string;
  provider: 'GitLab' | 'GitHub' | 'Bitbucket' | 'Other';
  description?: string;
  lastActivityAt?: string;
}

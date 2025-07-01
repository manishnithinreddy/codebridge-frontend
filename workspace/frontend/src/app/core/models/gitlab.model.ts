export interface GitlabProject {
  id: string;
  name: string;
  description?: string;
  webUrl: string;
  sshUrl: string;
  httpUrl: string;
  defaultBranch: string;
  visibility: 'private' | 'internal' | 'public';
  createdAt: Date;
  lastActivityAt: Date;
}

export interface GitlabRepository {
  id: string;
  name: string;
  fullName: string;
  description?: string;
  url: string;
  cloneUrl: string;
  defaultBranch: string;
  isPrivate: boolean;
  language?: string;
  size: number;
  starCount: number;
  forkCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface GitlabBranch {
  name: string;
  commit: GitlabCommit;
  protected: boolean;
  developersCanPush: boolean;
  developersCanMerge: boolean;
}

export interface GitlabCommit {
  id: string;
  shortId: string;
  title: string;
  message: string;
  authorName: string;
  authorEmail: string;
  authoredDate: Date;
  committerName: string;
  committerEmail: string;
  committedDate: Date;
}


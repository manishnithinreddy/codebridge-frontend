export interface GitCommit {
  sha: string;
  shortSha?: string;
  message: string;
  authorName: string;
  authorEmail?: string;
  authoredDate: string;
  committerName?: string;
  committerEmail?: string;
  committedDate?: string;
  webUrl?: string;
}

export interface GitBranch {
  name: string;
  lastCommitSha: string;
  protected?: boolean;
  merged?: boolean;
  webUrl?: string;
}

export interface OrgTeam {
  id: string;
  name: string;
  memberIds?: string[];
  memberCount: number;
  description?: string;
  createdAt?: string;
}

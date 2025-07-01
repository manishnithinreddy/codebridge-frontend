export interface OrgMember {
  id: string;
  name: string;
  username?: string;
  email: string;
  roleInOrg: string;
  teams?: { id: string, name: string }[];
  joinedDate: string;
  avatarUrl?: string;
}

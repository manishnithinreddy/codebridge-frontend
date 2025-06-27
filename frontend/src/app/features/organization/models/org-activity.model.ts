export interface OrgActivityItem {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  action: string;
  targetType?: string;
  targetId?: string;
  targetName?: string;
  details?: string | object;
}

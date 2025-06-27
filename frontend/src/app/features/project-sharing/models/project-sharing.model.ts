/**
 * Enum for share permission levels
 */
export enum SharePermissionLevel {
  VIEW_ONLY = 'VIEW_ONLY',
  CAN_EXECUTE = 'CAN_EXECUTE',
  CAN_EDIT = 'CAN_EDIT'
}

/**
 * Interface for share grant request
 */
export interface ShareGrantRequest {
  email: string;
  permissionLevel: SharePermissionLevel;
}

/**
 * Interface for share grant response
 */
export interface ShareGrantResponse {
  id: string;
  projectId: string;
  email: string;
  permissionLevel: SharePermissionLevel;
  createdAt: string;
  updatedAt: string;
}


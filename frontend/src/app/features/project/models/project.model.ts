/**
 * Interface for Project
 */
export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface for Project Request
 */
export interface ProjectRequest {
  name: string;
  description: string;
}

/**
 * Interface for Project Response
 */
export interface ProjectResponse {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}


/**
 * Interface for Environment Variable
 */
export interface EnvironmentVariable {
  key: string;
  value: string;
  description?: string;
}

/**
 * Interface for Environment
 */
export interface Environment {
  id: string;
  name: string;
  description: string;
  variables: EnvironmentVariable[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface for Environment Request
 */
export interface EnvironmentRequest {
  name: string;
  description: string;
  variables: EnvironmentVariable[];
  isDefault?: boolean;
}

/**
 * Interface for Environment Response
 */
export interface EnvironmentResponse {
  id: string;
  name: string;
  description: string;
  variables: EnvironmentVariable[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}


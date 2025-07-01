/**
 * Interface for Collection Variable
 */
export interface CollectionVariable {
  key: string;
  value: string;
  description?: string;
}

/**
 * Interface for Collection Script
 */
export interface CollectionScript {
  name: string;
  content: string;
  type: 'PRE_REQUEST' | 'POST_RESPONSE';
}

/**
 * Interface for Collection
 */
export interface Collection {
  id: string;
  projectId: string;
  name: string;
  description: string;
  variables: CollectionVariable[];
  scripts: CollectionScript[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface for Collection Request
 */
export interface CollectionRequest {
  name: string;
  description: string;
  projectId: string;
  variables: Record<string, string>;
  preRequestScript?: string;
  postRequestScript?: string;
  shared: boolean;
}

/**
 * Interface for Collection Response
 */
export interface CollectionResponse {
  id: string;
  projectId: string;
  projectName?: string;
  name: string;
  description: string;
  variables: Record<string, string>;
  preRequestScript?: string;
  postRequestScript?: string;
  shared: boolean;
  tests?: CollectionTestResponse[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface for Collection Test Response
 */
export interface CollectionTestResponse {
  id: string;
  testId: string;
  test?: any; // ApiTestResponse - can be defined later
  order: number;
  preRequestScript?: string;
  postRequestScript?: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface for Collection Test
 */
export interface CollectionTest {
  id: string;
  collectionId: string;
  name: string;
  description: string;
  status: 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILURE';
  results?: any;
  createdAt: string;
  updatedAt: string;
}

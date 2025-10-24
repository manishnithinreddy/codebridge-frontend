/**
 * Base interface for API test data
 */
export interface ApiTest {
  name: string;
  description?: string;
  method: string;
  url: string;
  headers?: Record<string, string>;
  requestBody?: string;
  expectedStatusCode?: number;
  expectedResponseBody?: string;
  validationScript?: string;
  timeoutMs: number;
}

/**
 * Interface for creating or updating an API test
 */
export interface ApiTestRequest extends ApiTest {
  // Additional fields specific to requests can be added here
}

/**
 * Interface for API test response from the server
 */
export interface ApiTestResponse extends ApiTest {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

/**
 * Interface for test execution results
 */
export interface TestResultResponse {
  id: string;
  testId: string;
  status: string;
  responseStatusCode?: number;
  responseBody?: string;
  responseHeaders?: Record<string, string>;
  executionTimeMs?: number;
  errorMessage?: string;
  createdAt: string;
}


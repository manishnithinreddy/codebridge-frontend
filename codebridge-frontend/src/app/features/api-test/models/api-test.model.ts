export interface ApiTest {
  id?: string;
  name: string;
  description?: string;
  url: string;
  method: string;
  headers?: Record<string, string>;
  requestBody?: string;
  expectedStatusCode?: number;
  expectedResponseBody?: string;
  validationScript?: string;
  timeoutMs: number;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiTestRequest {
  name: string;
  description?: string;
  url: string;
  method: string;
  headers?: Record<string, string>;
  requestBody?: string;
  expectedStatusCode?: number;
  expectedResponseBody?: string;
  validationScript?: string;
  timeoutMs: number;
}

export interface ApiTestResponse {
  id: string;
  name: string;
  description?: string;
  url: string;
  method: string;
  headers?: Record<string, string>;
  requestBody?: string;
  expectedStatusCode?: number;
  expectedResponseBody?: string;
  validationScript?: string;
  timeoutMs: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TestResultResponse {
  id: string;
  testId: string;
  status: string;
  responseStatusCode?: number;
  responseHeaders?: Record<string, string>;
  responseBody?: string;
  errorMessage?: string;
  executionTimeMs?: number;
  createdAt: string;
}


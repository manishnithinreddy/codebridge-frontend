import { BaseEntity } from './common.model';

/**
 * AI service models
 */

export interface AiAuthRequest {
  apiKey: string;
  provider: AiProvider;
  baseUrl?: string;
}

export interface AiAuthResponse {
  token: string;
  provider: AiProvider;
  expiresIn: number;
  capabilities: AiCapability[];
}

export type AiProvider = 'openai' | 'anthropic' | 'google' | 'azure' | 'huggingface' | 'local';

export interface AiCapability {
  type: 'completion' | 'embedding' | 'image' | 'audio' | 'video';
  models: string[];
  maxTokens?: number;
  supportedFormats?: string[];
}

export interface AiModel extends BaseEntity {
  name: string;
  displayName: string;
  provider: AiProvider;
  type: ModelType;
  description?: string;
  maxTokens: number;
  inputCost?: number;
  outputCost?: number;
  contextWindow: number;
  capabilities: string[];
  isActive: boolean;
  version?: string;
  trainingData?: string;
  parameters?: ModelParameters;
}

export type ModelType = 'completion' | 'embedding' | 'image' | 'audio' | 'multimodal';

export interface ModelParameters {
  temperature?: number;
  topP?: number;
  topK?: number;
  maxTokens?: number;
  stopSequences?: string[];
  frequencyPenalty?: number;
  presencePenalty?: number;
  repetitionPenalty?: number;
  seed?: number;
}

export interface CompletionRequest {
  model: string;
  messages: ChatMessage[];
  parameters?: ModelParameters;
  stream?: boolean;
  tools?: AiTool[];
  toolChoice?: 'auto' | 'none' | string;
  responseFormat?: ResponseFormat;
  metadata?: Record<string, any>;
}

export interface ChatMessage {
  role: MessageRole;
  content: string | MessageContent[];
  name?: string;
  toolCalls?: ToolCall[];
  toolCallId?: string;
}

export type MessageRole = 'system' | 'user' | 'assistant' | 'tool';

export interface MessageContent {
  type: 'text' | 'image' | 'audio' | 'video';
  text?: string;
  imageUrl?: ImageUrl;
  audioUrl?: string;
  videoUrl?: string;
}

export interface ImageUrl {
  url: string;
  detail?: 'low' | 'high' | 'auto';
}

export interface AiTool {
  type: 'function' | 'code_interpreter' | 'retrieval';
  function?: FunctionDefinition;
}

export interface FunctionDefinition {
  name: string;
  description?: string;
  parameters: Record<string, any>;
}

export interface ToolCall {
  id: string;
  type: 'function';
  function: FunctionCall;
}

export interface FunctionCall {
  name: string;
  arguments: string;
}

export interface ResponseFormat {
  type: 'text' | 'json_object' | 'json_schema';
  jsonSchema?: Record<string, any>;
}

export interface CompletionResponse {
  id: string;
  model: string;
  choices: CompletionChoice[];
  usage: TokenUsage;
  systemFingerprint?: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface CompletionChoice {
  index: number;
  message: ChatMessage;
  finishReason: FinishReason;
  logprobs?: LogProbs;
}

export type FinishReason = 'stop' | 'length' | 'tool_calls' | 'content_filter' | 'function_call';

export interface LogProbs {
  tokens: string[];
  tokenLogprobs: number[];
  topLogprobs?: Record<string, number>[];
  textOffset: number[];
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  promptCost?: number;
  completionCost?: number;
  totalCost?: number;
}

export interface EmbeddingRequest {
  model: string;
  input: string | string[];
  encodingFormat?: 'float' | 'base64';
  dimensions?: number;
  user?: string;
  metadata?: Record<string, any>;
}

export interface EmbeddingResponse {
  model: string;
  data: EmbeddingData[];
  usage: EmbeddingUsage;
  createdAt: string;
}

export interface EmbeddingData {
  index: number;
  embedding: number[];
  object: 'embedding';
}

export interface EmbeddingUsage {
  promptTokens: number;
  totalTokens: number;
  cost?: number;
}

export interface AiConversation extends BaseEntity {
  title: string;
  description?: string;
  model: string;
  messages: ChatMessage[];
  totalTokens: number;
  totalCost?: number;
  isArchived: boolean;
  tags: string[];
  metadata?: Record<string, any>;
  lastMessageAt: string;
}

export interface AiConversationCreateRequest {
  title: string;
  description?: string;
  model: string;
  systemMessage?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface AiConversationUpdateRequest {
  title?: string;
  description?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  isArchived?: boolean;
}

export interface AiTemplate extends BaseEntity {
  name: string;
  description?: string;
  category: TemplateCategory;
  systemPrompt: string;
  userPromptTemplate: string;
  parameters: TemplateParameter[];
  model?: string;
  modelParameters?: ModelParameters;
  isPublic: boolean;
  tags: string[];
  usageCount: number;
  rating?: number;
  author: string;
}

export type TemplateCategory = 
  | 'coding' | 'writing' | 'analysis' | 'translation' | 'summarization'
  | 'qa' | 'creative' | 'business' | 'education' | 'other';

export interface TemplateParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'multiselect';
  description?: string;
  required: boolean;
  defaultValue?: any;
  options?: string[];
  validation?: ParameterValidation;
}

export interface ParameterValidation {
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  customValidator?: string;
}

export interface AiTemplateCreateRequest {
  name: string;
  description?: string;
  category: TemplateCategory;
  systemPrompt: string;
  userPromptTemplate: string;
  parameters: TemplateParameter[];
  model?: string;
  modelParameters?: ModelParameters;
  isPublic?: boolean;
  tags?: string[];
}

export interface AiWorkflow extends BaseEntity {
  name: string;
  description?: string;
  steps: WorkflowStep[];
  isActive: boolean;
  triggers: WorkflowTrigger[];
  variables: WorkflowVariable[];
  tags: string[];
  executionCount: number;
  lastExecutedAt?: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: StepType;
  configuration: Record<string, any>;
  conditions?: StepCondition[];
  nextSteps: string[];
  errorHandling?: ErrorHandling;
}

export type StepType = 
  | 'completion' | 'embedding' | 'function_call' | 'condition'
  | 'loop' | 'delay' | 'webhook' | 'database' | 'file_operation';

export interface StepCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than';
  value: any;
}

export interface ErrorHandling {
  strategy: 'stop' | 'continue' | 'retry' | 'fallback';
  maxRetries?: number;
  retryDelay?: number;
  fallbackStep?: string;
}

export interface WorkflowTrigger {
  type: 'manual' | 'schedule' | 'webhook' | 'event';
  configuration: Record<string, any>;
  isActive: boolean;
}

export interface WorkflowVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  value: any;
  description?: string;
  isSecret: boolean;
}

export interface WorkflowExecution extends BaseEntity {
  workflowId: string;
  status: ExecutionStatus;
  trigger: string;
  input?: Record<string, any>;
  output?: Record<string, any>;
  steps: StepExecution[];
  startedAt: string;
  finishedAt?: string;
  duration?: number;
  error?: string;
  tokenUsage?: TokenUsage;
  cost?: number;
}

export type ExecutionStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface StepExecution {
  stepId: string;
  status: ExecutionStatus;
  input?: Record<string, any>;
  output?: Record<string, any>;
  startedAt: string;
  finishedAt?: string;
  duration?: number;
  error?: string;
  retryCount: number;
}

export interface AiUsageStats {
  period: 'hour' | 'day' | 'week' | 'month';
  startDate: string;
  endDate: string;
  totalRequests: number;
  totalTokens: number;
  totalCost: number;
  byModel: ModelUsageStats[];
  byUser: UserUsageStats[];
  byEndpoint: EndpointUsageStats[];
}

export interface ModelUsageStats {
  model: string;
  requests: number;
  tokens: number;
  cost: number;
  averageResponseTime: number;
  errorRate: number;
}

export interface UserUsageStats {
  userId: string;
  username: string;
  requests: number;
  tokens: number;
  cost: number;
}

export interface EndpointUsageStats {
  endpoint: string;
  requests: number;
  averageResponseTime: number;
  errorRate: number;
}

export interface AiConfiguration extends BaseEntity {
  provider: AiProvider;
  apiKey: string;
  baseUrl?: string;
  organizationId?: string;
  defaultModel?: string;
  rateLimits: RateLimit[];
  isActive: boolean;
  metadata?: Record<string, any>;
}

export interface RateLimit {
  type: 'requests' | 'tokens' | 'cost';
  limit: number;
  window: 'minute' | 'hour' | 'day' | 'month';
  scope: 'global' | 'user' | 'model';
}

export interface AiConfigurationCreateRequest {
  provider: AiProvider;
  apiKey: string;
  baseUrl?: string;
  organizationId?: string;
  defaultModel?: string;
  rateLimits?: RateLimit[];
  metadata?: Record<string, any>;
}

export interface AiConfigurationUpdateRequest {
  apiKey?: string;
  baseUrl?: string;
  organizationId?: string;
  defaultModel?: string;
  rateLimits?: RateLimit[];
  isActive?: boolean;
  metadata?: Record<string, any>;
}

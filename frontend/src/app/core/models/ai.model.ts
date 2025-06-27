export interface AiRequest {
  prompt: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  context?: string;
  type: 'code_generation' | 'code_review' | 'documentation' | 'general';
}

export interface AiResponse {
  id: string;
  response: string;
  model: string;
  tokensUsed: number;
  processingTime: number;
  confidence?: number;
  suggestions?: string[];
  createdAt: Date;
}

export interface CodeAnalysis {
  language: string;
  complexity: number;
  issues: CodeIssue[];
  suggestions: string[];
  metrics: CodeMetrics;
}

export interface CodeIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  line?: number;
  column?: number;
  severity: 'high' | 'medium' | 'low';
}

export interface CodeMetrics {
  linesOfCode: number;
  cyclomaticComplexity: number;
  maintainabilityIndex: number;
  technicalDebt: number;
}


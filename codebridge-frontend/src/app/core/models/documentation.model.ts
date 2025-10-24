import { BaseEntity } from './common.model';

/**
 * Documentation service models
 */

export interface Documentation extends BaseEntity {
  title: string;
  content: string;
  summary?: string;
  category: DocumentationCategory;
  tags: string[];
  isPublic: boolean;
  isPublished: boolean;
  version: string;
  language: string;
  author: string;
  lastModifiedBy: string;
  viewCount: number;
  rating?: number;
  ratingCount: number;
  metadata?: Record<string, any>;
}

export type DocumentationCategory = 
  | 'api' | 'tutorial' | 'guide' | 'reference' | 'faq' 
  | 'troubleshooting' | 'changelog' | 'architecture' | 'other';

export interface DocumentationCreateRequest {
  title: string;
  content: string;
  summary?: string;
  category: DocumentationCategory;
  tags?: string[];
  isPublic?: boolean;
  isPublished?: boolean;
  language?: string;
  metadata?: Record<string, any>;
}

export interface DocumentationUpdateRequest {
  title?: string;
  content?: string;
  summary?: string;
  category?: DocumentationCategory;
  tags?: string[];
  isPublic?: boolean;
  isPublished?: boolean;
  language?: string;
  metadata?: Record<string, any>;
}

export interface DocumentationSearchRequest {
  query: string;
  category?: DocumentationCategory;
  tags?: string[];
  language?: string;
  isPublic?: boolean;
  limit?: number;
  offset?: number;
}

export interface DocumentationSearchResult {
  id: string;
  title: string;
  summary?: string;
  category: DocumentationCategory;
  tags: string[];
  score: number;
  highlights: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DocumentationVersion extends BaseEntity {
  documentationId: string;
  version: string;
  title: string;
  content: string;
  changeLog?: string;
  author: string;
  isActive: boolean;
}

export interface DocumentationComment extends BaseEntity {
  documentationId: string;
  parentCommentId?: string;
  content: string;
  author: string;
  isResolved: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
  upvotes: number;
  downvotes: number;
}

export interface DocumentationRating extends BaseEntity {
  documentationId: string;
  userId: string;
  rating: number; // 1-5
  comment?: string;
}

export interface DocumentationAnalytics {
  documentationId: string;
  period: 'day' | 'week' | 'month' | 'year';
  startDate: string;
  endDate: string;
  views: number;
  uniqueViews: number;
  averageReadTime: number;
  bounceRate: number;
  topReferrers: ReferrerStats[];
  searchQueries: SearchQueryStats[];
}

export interface ReferrerStats {
  referrer: string;
  count: number;
  percentage: number;
}

export interface SearchQueryStats {
  query: string;
  count: number;
  resultPosition?: number;
}

export interface DocumentationTemplate extends BaseEntity {
  name: string;
  description?: string;
  category: DocumentationCategory;
  template: string;
  variables: TemplateVariable[];
  isPublic: boolean;
  usageCount: number;
}

export interface TemplateVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'select';
  description?: string;
  required: boolean;
  defaultValue?: any;
  options?: string[];
}

export interface DocumentationExport {
  format: 'pdf' | 'html' | 'markdown' | 'docx';
  documentationIds: string[];
  includeComments?: boolean;
  includeVersionHistory?: boolean;
  template?: string;
}

export interface DocumentationImport {
  format: 'markdown' | 'html' | 'docx' | 'confluence' | 'notion';
  content: string;
  preserveFormatting?: boolean;
  extractMetadata?: boolean;
}

export interface DocumentationWorkflow extends BaseEntity {
  name: string;
  description?: string;
  steps: WorkflowStep[];
  isActive: boolean;
  triggers: WorkflowTrigger[];
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'review' | 'approval' | 'notification' | 'publish' | 'archive';
  assignees: string[];
  conditions?: Record<string, any>;
  nextSteps: string[];
}

export interface WorkflowTrigger {
  type: 'create' | 'update' | 'publish' | 'schedule';
  conditions?: Record<string, any>;
}

export interface DocumentationCollection extends BaseEntity {
  name: string;
  description?: string;
  documentationIds: string[];
  isPublic: boolean;
  tags: string[];
  order: number;
}

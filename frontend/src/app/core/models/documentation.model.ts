export interface Documentation {
  id: string;
  title: string;
  content: string;
  type: DocumentationType;
  projectId?: string;
  authorId: string;
  tags: string[];
  version: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

export interface DocumentationRequest {
  title: string;
  content: string;
  type: DocumentationType;
  projectId?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export type DocumentationType = 
  | 'api'
  | 'user_guide'
  | 'technical'
  | 'tutorial'
  | 'reference'
  | 'changelog'
  | 'readme';

export interface DocumentationSection {
  id: string;
  title: string;
  content: string;
  order: number;
  parentId?: string;
  children?: DocumentationSection[];
}

export interface DocumentationTemplate {
  id: string;
  name: string;
  description: string;
  type: DocumentationType;
  template: string;
  variables: TemplateVariable[];
}

export interface TemplateVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array';
  required: boolean;
  defaultValue?: any;
  description?: string;
}


export interface Session {
  id: string;
  name: string;
  description?: string;
  userId: string;
  projectId?: string;
  status: 'active' | 'inactive' | 'expired';
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  metadata?: Record<string, any>;
}

export interface SessionRequest {
  name: string;
  description?: string;
  projectId?: string;
  duration?: number; // in minutes
  metadata?: Record<string, any>;
}

export interface SessionActivity {
  id: string;
  sessionId: string;
  action: string;
  details: Record<string, any>;
  timestamp: Date;
  userId: string;
}


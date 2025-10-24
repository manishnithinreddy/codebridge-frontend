import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { AiResponse, AiRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AiService extends BaseApiService {
  protected override readonly baseUrl = '/api/ai';

  /**
   * Generate AI response
   */
  generateResponse(request: AiRequest): Observable<AiResponse> {
    return this.post<AiResponse>('/generate', request);
  }

  /**
   * Get AI models
   */
  getModels(): Observable<string[]> {
    return this.get<string[]>('/models');
  }

  /**
   * Analyze code
   */
  analyzeCode(code: string, language: string): Observable<any> {
    return this.post<any>('/analyze', { code, language });
  }
}

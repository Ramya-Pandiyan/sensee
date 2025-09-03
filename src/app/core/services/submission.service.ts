import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Submission {
  id: string;
  insuredName: string;
  receivedDate: string;
  status: 'new' | 'in-review' | 'completed';
  priority: 'low' | 'medium' | 'high';
  category: 'due-today' | 'needs-review' | 'watchlist';
  claimId?: string;
  market?: string;
  homeState?: string;
  dateOfLoss?: string;
  catNumber?: string;
  lossCause?: string;
}

export interface SubmissionDetail {
  id: string;
  emailSummary: string;
  insuredOperations: any;
  lossExperience: any;
  appetiteCheck: any;
  missingInformation: string[];
}

export interface ChatMessage {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
  hasAction?: boolean;
  actionText?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {
  constructor(private http: HttpClient) {}

  getSubmissions(): Observable<any> {
    return this.http.get('/assets/mock-data/submissions.json').pipe(delay(500));
  }

  getSubmissionDetail(id: string): Observable<any> {
    return this.http.get('/assets/mock-data/submission-detail.json').pipe(delay(500));
  }

getChatHistory(): Observable<any> {
  return this.http.get<any>(
    'https://sense-dev-backend-service-as.azurewebsites.net/api/v1/chats'
  );
}

  getInitialChatMessages(): Observable<any> {
    return this.http.get('/assets/mock-data/initial-chat.json').pipe(delay(800));
  }

  sendEmailToBroker(submissionId: string, emailContent: string): Observable<any> {
    return this.http.get('/assets/mock-data/email-send-response.json').pipe(delay(1000));
  }

  getEmailDraft(): Observable<any> {
    return this.http.get('/assets/mock-data/email-draft.json').pipe(delay(500));
  }
}
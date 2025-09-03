import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { SubmissionService } from '../../../core/services/submission.service';
import { ChatInterfaceComponent } from '../../../shared/chat-interface/chat-interface.component';
import { ChatMessage } from '../../../data/model/submission.model';

@Component({
  selector: 'app-existing-chat',
  standalone: true,
  imports: [CommonModule, ChatInterfaceComponent],
  templateUrl: './existing-chat.component.html',
  styleUrl: './existing-chat.component.scss'
})
export class ExistingChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  chatMessages: ChatMessage[] = [];
  isLoading = false;
  chatId = '';
  private destroy$ = new Subject<void>();

  constructor(
    private submissionService: SubmissionService,
    private router: Router,
    private route: ActivatedRoute,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.chatId = params['chatId'];
      this.loadChatHistory();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @ViewChild('chatMessage') private chatMessagesContainer!: ElementRef<HTMLDivElement>;

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.chatMessagesContainer.nativeElement.scrollTop =
        this.chatMessagesContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  private loadChatHistory(): void {
    this.isLoading = true;
    
    // Mock chat data for existing chat
    const mockChatData = {
      messages: [
        {
          id: 'msg-001',
          type: 'bot',
          content: 'Welcome back! This is your existing chat conversation.',
          timestamp: new Date(Date.now() - 3600000) // 1 hour ago
        },
        {
          id: 'msg-002',
          type: 'user',
          content: 'Can you help me review this submission?',
          timestamp: new Date(Date.now() - 3000000) // 50 minutes ago
        },
        {
          id: 'msg-003',
          type: 'bot',
          content: 'Of course! I can help you analyze the submission details. What specific aspects would you like me to focus on?',
          timestamp: new Date(Date.now() - 2400000) // 40 minutes ago
        }
      ]
    };

    setTimeout(() => {
      this.chatMessages = mockChatData.messages;
      this.isLoading = false;
    }, 500);
  }

  onActionClick(actionType: string): void {
    if (actionType === 'open-submission') {
      this.router.navigate(['/home/underwriting/submission', 'SUB-001']);
    }
  }

  onSendMessage(message: string): void {
    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: message,
      timestamp: new Date()
    };
    this.chatMessages.push(userMessage);

    // Simulate bot response
    const botMessage: ChatMessage = {
      id: `bot-${Date.now()}`,
      type: 'bot',
      content: 'Thank you for your message. I\'m processing your request...',
      timestamp: new Date()
    };
    this.chatMessages.push(botMessage);
    
    this.ngZone.onStable.pipe(take(1)).subscribe(() => {
      this.scrollToBottom();
    });
  }
}
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { SubmissionService } from '../../../core/services/submission.service';
import { ChatInterfaceComponent } from '../../../shared/chat-interface/chat-interface.component';
import { ChatMessage } from '../../../data/model/submission.model';
import { Common } from '../../../shared/common/common.service';

@Component({
  selector: 'app-new-chat',
  standalone: true,
  imports: [CommonModule, ChatInterfaceComponent],
  templateUrl: './new-chat.component.html',
  styleUrl: './new-chat.component.scss'
})
export class NewChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  chatMessages: ChatMessage[] = [];
  isLoading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private submissionService: SubmissionService,
    private router: Router,
    private ngZone: NgZone,
    private commonService: Common
  ) {}

  ngOnInit(): void {
    this.loadInitialChatMessages();
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

  private loadInitialChatMessages(): void {
    this.isLoading = true;
    this.submissionService.getInitialChatMessages()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.chatMessages = response.messages;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading chat messages:', error);
          this.isLoading = false;
        }
      });
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
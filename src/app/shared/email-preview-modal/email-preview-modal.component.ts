import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RightPanelComponent } from '../right-panel/right-panel.component';
import { SubmissionService } from '../../core/services/submission.service';
import { EmailDraft } from '../../data/model/submission.model';

@Component({
  selector: 'app-email-preview-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, RightPanelComponent],
  templateUrl: './email-preview-modal.component.html',
  styleUrls: ['./email-preview-modal.component.scss']
})
export class EmailPreviewModalComponent implements OnInit {
  @Input() isOpen = false;
  @Input() submissionId = '';
  @Output() close = new EventEmitter<void>();
  @Output() emailSent = new EventEmitter<void>();

  emailDraft: EmailDraft | null = null;
  isLoading = false;
  isSending = false;
  attachments: File[] = [];

  constructor(private submissionService: SubmissionService) {}

  ngOnInit(): void {
    if (!this.isOpen) {
      this.loadEmailDraft();
    }
  }

  private loadEmailDraft(): void {
    this.isLoading = true;
    this.submissionService.getEmailDraft().subscribe({
      next: (response) => {
        this.emailDraft = response.draft;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading email draft:', error);
        this.isLoading = false;
      }
    });
  }

  onClose(): void {
    this.close.emit();
  }

  formatText(command: string): void {
    document.execCommand(command, false, '');
  }

  isFormatActive(command: string): boolean {
    return document.queryCommandState(command);
  }

  onBodyChange(event: Event): void {
    if (this.emailDraft) {
      this.emailDraft.body = (event.target as HTMLElement).innerHTML;
    }
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      for (let i = 0; i < input.files.length; i++) {
        this.attachments.push(input.files[i]);
      }
    }
  }

  removeAttachment(index: number): void {
    this.attachments.splice(index, 1);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  onSend(): void {
    if (this.emailDraft && !this.isSending) {
      this.isSending = true;
      
      this.submissionService.sendEmailToBroker(this.submissionId, this.emailDraft.body).subscribe({
        next: (response) => {
          this.emailSent.emit();
          this.isSending = false;
          this.onClose();
        },
        error: (error) => {
          console.error('Error sending email:', error);
          this.isSending = false;
        }
      });
    }
  }
}
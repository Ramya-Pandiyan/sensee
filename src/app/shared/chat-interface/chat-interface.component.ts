import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-interface',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-interface.component.html',
  styleUrl: './chat-interface.component.scss'
})
export class ChatInterfaceComponent {
  @Input() placeholder = 'Type your message...';
  @Input() disabled = false;
  @Output() messageSubmitted = new EventEmitter<string>();

  message = '';

  onSubmit(): void {
    if (this.message.trim() && !this.disabled) {
      this.messageSubmitted.emit(this.message.trim());
      this.message = '';
    }
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.onSubmit();
    }
  }
}
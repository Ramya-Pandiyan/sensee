import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-empty-chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './empty-chat.component.html',
  styleUrl: './empty-chat.component.scss'
})
export class EmptyChatComponent {
  constructor(private router: Router) {}

  onNewChatClick(): void {
    this.router.navigate(['/home/new-chat']);
  }
}
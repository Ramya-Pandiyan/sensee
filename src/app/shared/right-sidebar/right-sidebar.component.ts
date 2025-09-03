import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SubmissionService, Submission } from '../../core/services/submission.service';

@Component({
  selector: 'app-right-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './right-sidebar.component.html',
  styleUrl: './right-sidebar.component.scss'
})
export class RightSidebarComponent implements OnInit, OnDestroy {
  submissions: any = {};
  activeTab = 'due-today';
  
  private destroy$ = new Subject<void>();

  constructor(
    private submissionService: SubmissionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('initialized right sidebar component')
    this.loadSubmissions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadSubmissions(): void {
    this.submissionService.getSubmissions()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.submissions = response;
        },
        error: (error) => {
          console.error('Error loading submissions:', error);
        }
      });
  }

  onSubmissionClick(submission: Submission): void {
    this.router.navigate(['/dashboard/submission', submission.id]);
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  getPriorityClass(priority: string): string {
    return `priority-${priority}`;
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }
}
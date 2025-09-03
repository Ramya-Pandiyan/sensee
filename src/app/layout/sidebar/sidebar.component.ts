// // import { Component, OnInit, OnDestroy } from '@angular/core';
// // import { CommonModule } from '@angular/common';
// // import { Router } from '@angular/router';
// // import { Subject } from 'rxjs';
// // import { takeUntil } from 'rxjs/operators';

// // import { SubmissionService, Submission } from '../../core/services/submission.service';
// // import { AuthService } from '../../core/services/auth.service';
// // import { User } from '../../data/model/user.model';

// // @Component({
// //   selector: 'app-sidebar',
// //   standalone: true,
// //   imports: [CommonModule],
// //   templateUrl: './sidebar.component.html',
// //   styleUrl: './sidebar.component.scss'
// // })
// // export class SidebarComponent implements OnInit, OnDestroy {
// //   isSubSidebarOpen = false;
// //   isRightSidebarOpen = false;
// //   currentUser: User | null = null;
// //   chatHistory: any[] = [];
// //   submissions: any = {};
// //   activeTab = 'due-today';
  
// //   private destroy$ = new Subject<void>();

// //   constructor(
// //     private submissionService: SubmissionService,
// //     private authService: AuthService,
// //     private router: Router
// //   ) {}

// //   ngOnInit(): void {
// //     this.authService.currentUser$
// //       .pipe(takeUntil(this.destroy$))
// //       .subscribe(user => {
// //         this.currentUser = user;
// //       });

// //     this.loadChatHistory();
// //     this.loadSubmissions();
// //   }

// //   ngOnDestroy(): void {
// //     this.destroy$.next();
// //     this.destroy$.complete();
// //   }

// //   private loadChatHistory(): void {
// //     this.submissionService.getChatHistory()
// //       .pipe(takeUntil(this.destroy$))
// //       .subscribe({
// //         next: (response) => {
// //           this.chatHistory = response.chatHistory;
// //         },
// //         error: (error) => {
// //           console.error('Error loading chat history:', error);
// //         }
// //       });
// //   }

// //   private loadSubmissions(): void {
// //     this.submissionService.getSubmissions()
// //       .pipe(takeUntil(this.destroy$))
// //       .subscribe({
// //         next: (response) => {
// //           this.submissions = response;
// //         },
// //         error: (error) => {
// //           console.error('Error loading submissions:', error);
// //         }
// //       });
// //   }

// //   toggleSubSidebar(): void {
// //     this.isSubSidebarOpen = !this.isSubSidebarOpen;
// //     if (!this.isSubSidebarOpen) {
// //       this.isRightSidebarOpen = false;
// //     }
// //   }

// //   onUnderwritingClick(): void {
// //     this.isRightSidebarOpen = true;
// //     // Trigger initial chat messages in dashboard
// //     this.router.navigate(['/dashboard']);
// //   }

// //   onSubmissionClick(submission: Submission): void {
// //     this.router.navigate(['/dashboard/submission', submission.id]);
// //   }

// //   onChatHistoryClick(chat: any): void {
// //     this.router.navigate(['/dashboard/submission', chat.submissionId]);
// //   }

// //   onLogout(): void {
// //     this.authService.logout();
// //     this.router.navigate(['/auth/login']);
// //   }

// //   setActiveTab(tab: string): void {
// //     this.activeTab = tab;
// //   }

// //   getPriorityClass(priority: string): string {
// //     return `priority-${priority}`;
// //   }

// //   getStatusClass(status: string): string {
// //     return `status-${status}`;
// //   }
// // }

// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router';
// import { Subject } from 'rxjs';
// import { takeUntil } from 'rxjs/operators';

// import { SubmissionService } from '../../core/services/submission.service';
// import { AuthService } from '../../core/services/auth.service';
// import { User } from '../../data/model/user.model';

// @Component({
//   selector: 'app-sidebar',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './sidebar.component.html',
//   styleUrl: './sidebar.component.scss'
// })
// export class SidebarComponent implements OnInit, OnDestroy {
//   isSubSidebarOpen = false;
//   currentUser: User | null = null;
//   chatHistory: any[] = [];
  
//   private destroy$ = new Subject<void>();

//   constructor(
//     private submissionService: SubmissionService,
//     private authService: AuthService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.authService.currentUser$
//       .pipe(takeUntil(this.destroy$))
//       .subscribe(user => {
//         this.currentUser = user;
//       });

//     this.loadChatHistory();
//   }

//   ngOnDestroy(): void {
//     this.destroy$.next();
//     this.destroy$.complete();
//   }

//   private loadChatHistory(): void {
//     this.submissionService.getChatHistory()
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: (response) => {
//           this.chatHistory = response.chatHistory;
//         },
//         error: (error) => {
//           console.error('Error loading chat history:', error);
//         }
//       });
//   }

//   onHomeHover(): void {
//     this.isSubSidebarOpen = !this.isSubSidebarOpen;
//   }

//   toggleSubSidebar(): void {
//     this.isSubSidebarOpen = !this.isSubSidebarOpen;
//   }

//   onSubSidebarMouseEnter(): void {
//     this.isSubSidebarOpen = true;
//   }

//   onSubSidebarMouseLeave(): void {
//     this.isSubSidebarOpen = false;
//   }

//   onUnderwritingClick(): void {
//     // Trigger initial chat messages in dashboard
//     this.router.navigate(['/dashboard']);
//   }

//   onChatHistoryClick(chat: any): void {
//     this.router.navigate(['/dashboard/submission', chat.submissionId]);
//   }

//   onLogout(): void {
//     this.authService.logout();
//     this.router.navigate(['/auth/login']);
//   }
// }


import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SubmissionService } from '../../core/services/submission.service';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../data/model/user.model';
import { Common } from '../../shared/common/common.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit, OnDestroy {
  isSubSidebarOpen = false;
  currentUser: User | null = null;
  chatHistory: any[] = [];
   @Output() underwritingClicked = new EventEmitter<void>();
  
   private destroy$ = new Subject<void>();

  constructor(
    private submissionService: SubmissionService,
    private authService: AuthService,
    private router: Router,
    private commonService: Common
  ) {}
  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
      });

    this.loadChatHistory();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

private loadChatHistory(): void {
  this.submissionService.getChatHistory()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        if (response && response.chats) {
          this.chatHistory = response.chats.map((chat: any) => ({
            id: chat._id,
            title: chat.title,
            date: chat.updated_date || chat.created_date,
            submissionId: chat._id // no submissionId in backend, so fallback to _id
          }));
        } else {
          this.chatHistory = [];
        }
      },
      error: (error) => {
        console.error('Error loading chat history:', error);
        this.chatHistory = [];
      }
    });
}


  onHomeHover(): void {
    this.isSubSidebarOpen = !this.isSubSidebarOpen;
  }

  toggleSubSidebar(): void {
    this.isSubSidebarOpen = !this.isSubSidebarOpen;
  }

  onSubSidebarMouseEnter(): void {
    this.isSubSidebarOpen = true;
  }

  onSubSidebarMouseLeave(): void {
    this.isSubSidebarOpen = false;
  }

  onUnderwritingClick(): void {
    this.underwritingClicked.emit();
    this.commonService.emitUnderwritingClicked();
    this.router.navigate(['/home/underwriting/dashboard']);
  }

  onNewChatClick(): void {
    this.router.navigate(['/home/new-chat']);
  }

  onChatHistoryClick(chat: any): void {
    this.router.navigate(['/home/chat', chat.id]);
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }


  openSubSidebar() {
  this.isSubSidebarOpen = true;
}

closeSubSidebar() {
  this.isSubSidebarOpen = false;
}
}
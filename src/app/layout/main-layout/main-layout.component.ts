// // import { Component, OnInit, OnDestroy } from '@angular/core';
// // import { CommonModule } from '@angular/common';
// // import { RouterOutlet } from '@angular/router';
// // import { Subject } from 'rxjs';
// // import { takeUntil } from 'rxjs/operators';

// // import { HeaderComponent } from '../header/header.component';
// // import { SidebarComponent } from '../sidebar/sidebar.component';
// // import { NotificationService, Toast } from '../../core/services/notification.service';

// // @Component({
// //   selector: 'app-main-layout',
// //   standalone: true,
// //   imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent],
// //   templateUrl: './main-layout.component.html',
// //   styleUrl: './main-layout.component.scss'
// // })
// // export class MainLayoutComponent implements OnInit, OnDestroy {
// //   toasts: Toast[] = [];
// //   private destroy$ = new Subject<void>();

// //   constructor(private notificationService: NotificationService) {}

// //   ngOnInit(): void {
// //     this.notificationService.toasts$
// //       .pipe(takeUntil(this.destroy$))
// //       .subscribe(toasts => {
// //         this.toasts = toasts;
// //       });
// //   }

// //   ngOnDestroy(): void {
// //     this.destroy$.next();
// //     this.destroy$.complete();
// //   }

// //   removeToast(id: string): void {
// //     this.notificationService.removeToast(id);
// //   }
// // }


// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterOutlet } from '@angular/router';
// import { Subject } from 'rxjs';
// import { takeUntil } from 'rxjs/operators';

// import { HeaderComponent } from '../header/header.component';
// import { SidebarComponent } from '../sidebar/sidebar.component';
// import { RightSidebarComponent } from '../../shared/right-sidebar/right-sidebar.component';
// import { NotificationService, Toast } from '../../core/services/notification.service';

// @Component({
//   selector: 'app-main-layout',
//   standalone: true,
//   imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent, RightSidebarComponent],
//   templateUrl: './main-layout.component.html',
//   styleUrl: './main-layout.component.scss'
// })
// export class MainLayoutComponent implements OnInit, OnDestroy {
//   toasts: Toast[] = [];
//   private destroy$ = new Subject<void>();

//   constructor(private notificationService: NotificationService) {}

//   ngOnInit(): void {
//     this.notificationService.toasts$
//       .pipe(takeUntil(this.destroy$))
//       .subscribe(toasts => {
//         this.toasts = toasts;
//       });
//   }

//   ngOnDestroy(): void {
//     this.destroy$.next();
//     this.destroy$.complete();
//   }

//   removeToast(id: string): void {
//     this.notificationService.removeToast(id);
//   }
// }






import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RightSidebarComponent } from '../../shared/right-sidebar/right-sidebar.component';
import { NotificationService, Toast } from '../../core/services/notification.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent, RightSidebarComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private destroy$ = new Subject<void>();

  showRightSidebar = false;
  http: HttpClient;

  constructor(private notificationService: NotificationService, http: HttpClient) {
    this.http = http;
  }

  ngOnInit(): void {
    this.notificationService.toasts$
      .pipe(takeUntil(this.destroy$))
      .subscribe(toasts => {
        this.toasts = toasts;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  removeToast(id: string): void {
    this.notificationService.removeToast(id);
  }

  onUnderwritingClicked() {
    this.showRightSidebar = true;
  }
}
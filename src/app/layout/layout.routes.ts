import { Routes } from '@angular/router';

export const layoutRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./center-panel/center-panel-component').then(m => m.DashboardComponent)
      },
      {
        path: 'submission/:id',
        loadComponent: () => import('./submission-detail/submission-detail.component').then(m => m.SubmissionDetailComponent)
      }
    ]
  }
];
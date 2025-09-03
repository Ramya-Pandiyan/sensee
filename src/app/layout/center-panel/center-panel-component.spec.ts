import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { DashboardComponent } from './center-panel-component';
import { SubmissionService } from '../../core/services/submission.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockSubmissionService: jasmine.SpyObj<SubmissionService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const submissionServiceSpy = jasmine.createSpyObj('SubmissionService', ['getInitialChatMessages']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: SubmissionService, useValue: submissionServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    mockSubmissionService = TestBed.inject(SubmissionService) as jasmine.SpyObj<SubmissionService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    mockSubmissionService.getInitialChatMessages.and.returnValue(of({ messages: [] }));
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load initial chat messages on init', () => {
    expect(mockSubmissionService.getInitialChatMessages).toHaveBeenCalled();
  });
});
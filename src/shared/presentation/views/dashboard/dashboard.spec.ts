import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Dashboard } from './dashboard';
import { UserService } from '../../../infrastructure/services/user.service';
import { BookingService } from '../../../infrastructure/services/booking.service';
import { SeoService } from '../../../infrastructure/services/seo.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

describe('DashboardComponent', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let bookingServiceSpy: jasmine.SpyObj<BookingService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let seoServiceSpy: jasmine.SpyObj<SeoService>;

  beforeEach(async () => {
    const uSpy = jasmine.createSpyObj('UserService', ['getCurrentUser', 'getUserStats', 'getUserActivities']);
    const bSpy = jasmine.createSpyObj('BookingService', ['getAllBookings']);
    const rSpy = jasmine.createSpyObj('Router', ['navigate']);
    const sSpy = jasmine.createSpyObj('SeoService', ['updateSeoTags']);

    await TestBed.configureTestingModule({
      imports: [Dashboard, TranslateModule.forRoot()],
      providers: [
        { provide: UserService, useValue: uSpy },
        { provide: BookingService, useValue: bSpy },
        { provide: Router, useValue: rSpy },
        { provide: SeoService, useValue: sSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    bookingServiceSpy = TestBed.inject(BookingService) as jasmine.SpyObj<BookingService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    seoServiceSpy = TestBed.inject(SeoService) as jasmine.SpyObj<SeoService>;

    // Setup default mock returns
    userServiceSpy.getCurrentUser.and.returnValue(of({ id: '1', name: 'Test User', email: 'test@example.com', phone: '123', favoriteSpot: 'tennis' }));
    userServiceSpy.getUserStats.and.returnValue(of({ totalBookings: 5, hoursPlayed: 10, favoriteSport: 'Tennis' }));
    userServiceSpy.getUserActivities.and.returnValue(of([]));
    bookingServiceSpy.getAllBookings.and.returnValue(of([]));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user data on init', () => {
    expect(userServiceSpy.getCurrentUser).toHaveBeenCalled();
    expect(component.user()).toBeDefined();
    expect(component.user()?.name).toBe('Test User');
  });

  it('should load user stats', () => {
    expect(userServiceSpy.getUserStats).toHaveBeenCalledWith('1');
    expect(component.dashboardStats()).toEqual({ totalBookings: 5, hoursPlayed: 10, favoriteSport: 'Tennis' });
  });

  it('should navigate to find court', () => {
    component.onFindCourt();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/search-courts']);
  });

  it('should navigate to find coach', () => {
    component.onFindCoach();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/search-coaches']);
  });
});

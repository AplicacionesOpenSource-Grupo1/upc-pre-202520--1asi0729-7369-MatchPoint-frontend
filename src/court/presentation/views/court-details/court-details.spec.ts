import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { CourtDetailsComponent } from './court-details';

describe('CourtDetailsComponent', () => {
  let component: CourtDetailsComponent;
  let fixture: ComponentFixture<CourtDetailsComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('test-court-id')
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [
        CourtDetailsComponent,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        TranslateService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CourtDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load court details on init', () => {
    expect(component.courtId()).toBe('test-court-id');
    expect(component.isLoading()).toBe(true);
    
    // Wait for the simulated API call
    setTimeout(() => {
      expect(component.court()).toBeTruthy();
      expect(component.isLoading()).toBe(false);
    }, 1100);
  });

  it('should navigate back to court search', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/court-search']);
  });

  it('should select image correctly', () => {
    component.selectImage(1);
    expect(component.selectedImageIndex()).toBe(1);
  });

  it('should filter available slots', () => {
    // Set up test data
    component.court.set({
      id: 'test',
      name: 'Test Court',
      location: 'Test Location',
      price: 80,
      rating: 4.5,
      reviews: 100,
      description: 'Test description',
      amenities: [],
      images: [],
      availability: [
        { time: '10:00', available: true, price: 80 },
        { time: '11:00', available: false, price: 80 },
        { time: '12:00', available: true, price: 90 }
      ],
      sport: 'Tennis',
      surface: 'Clay',
      capacity: 4,
      contact: {
        phone: '+51 123 456 789',
        email: 'test@test.com'
      }
    });

    const availableSlots = component.availableSlots();
    expect(availableSlots.length).toBe(2);
    expect(availableSlots[0].time).toBe('10:00');
    expect(availableSlots[1].time).toBe('12:00');
  });

  it('should handle booking slot', () => {
    spyOn(window, 'alert');
    const testSlot = { time: '10:00', available: true, price: 80 };
    
    component.bookSlot(testSlot);
    
    expect(window.alert).toHaveBeenCalledWith('Reservando cancha para las 10:00 - S/ 80');
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { CoachDetailsComponent } from './coach-details';

describe('CoachDetailsComponent', () => {
  let component: CoachDetailsComponent;
  let fixture: ComponentFixture<CoachDetailsComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('test-coach-id')
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [
        CoachDetailsComponent,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        TranslateService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CoachDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load coach details on init', () => {
    expect(component.coachId()).toBe('test-coach-id');
    expect(component.isLoading()).toBe(true);
    
    // Wait for the simulated API call
    setTimeout(() => {
      expect(component.coach()).toBeTruthy();
      expect(component.isLoading()).toBe(false);
    }, 1100);
  });

  it('should navigate back to coach search', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/search-coaches']);
  });

  it('should select image correctly', () => {
    component.selectImage(1);
    expect(component.selectedImageIndex()).toBe(1);
  });

  it('should filter available slots', () => {
    const today = new Date().toISOString().split('T')[0];
    
    // Set up test data
    component.coach.set({
      id: 'test',
      name: 'Test Coach',
      location: 'Test Location',
      pricePerHour: 120,
      rating: 4.5,
      reviews: 100,
      description: 'Test description',
      specialties: [],
      images: [],
      availability: [
        { time: '10:00', available: true, price: 120, date: today },
        { time: '11:00', available: false, price: 120, date: today },
        { time: '12:00', available: true, price: 140, date: today }
      ],
      sports: ['Tennis'],
      experience: 5,
      certifications: [],
      languages: ['Spanish'],
      contact: {
        phone: '+51 123 456 789',
        email: 'test@test.com'
      },
      level: 'intermediate'
    });

    const availableSlots = component.availableSlots();
    expect(availableSlots.length).toBe(2);
    expect(availableSlots[0].time).toBe('10:00');
    expect(availableSlots[1].time).toBe('12:00');
  });

  it('should handle booking session', () => {
    spyOn(window, 'alert');
    const testSlot = { time: '10:00', available: true, price: 120, date: '2024-01-01' };
    
    component.bookSession(testSlot);
    
    expect(window.alert).toHaveBeenCalledWith('Reservando sesión para las 10:00 - S/ 120');
  });

  it('should get level text correctly', () => {
    expect(component.getLevelText('beginner')).toBe('Principiante');
    expect(component.getLevelText('intermediate')).toBe('Intermedio');
    expect(component.getLevelText('advanced')).toBe('Avanzado');
    expect(component.getLevelText('professional')).toBe('Profesional');
  });
});

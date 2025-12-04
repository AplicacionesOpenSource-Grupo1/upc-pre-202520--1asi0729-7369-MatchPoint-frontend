import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CourtSearch } from './court-search';
import { CourtService } from '../../../infrastructure/services/court.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { signal } from '@angular/core';

describe('CourtSearchComponent', () => {
    let component: CourtSearch;
    let fixture: ComponentFixture<CourtSearch>;
    let courtServiceSpy: jasmine.SpyObj<CourtService>;
    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        const cSpy = jasmine.createSpyObj('CourtService', ['getAllCourts']);
        const rSpy = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [CourtSearch, TranslateModule.forRoot()],
            providers: [
                { provide: CourtService, useValue: cSpy },
                { provide: Router, useValue: rSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(CourtSearch);
        component = fixture.componentInstance;
        courtServiceSpy = TestBed.inject(CourtService) as jasmine.SpyObj<CourtService>;
        routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

        // Setup default mock returns
        const mockCourts = [
            { id: '1', name: 'Court A', location: 'Location A', price: 100, rating: 4.5, sport: 'tennis' },
            { id: '2', name: 'Court B', location: 'Location B', price: 150, rating: 3.5, sport: 'padel' }
        ];
        courtServiceSpy.getAllCourts.and.returnValue(of(mockCourts as any));

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load courts on init', () => {
        expect(courtServiceSpy.getAllCourts).toHaveBeenCalled();
        expect(component.courts().length).toBe(2);
    });

    it('should filter courts by search query', () => {
        component.onSearchChange('Court A');
        const filtered = component.filteredCourts();
        expect(filtered.length).toBe(1);
        expect(filtered[0].name).toBe('Court A');
    });

    it('should filter courts by sport', () => {
        component.onSportChange('padel');
        const filtered = component.filteredCourts();
        expect(filtered.length).toBe(1);
        expect(filtered[0].sport).toBe('padel');
    });

    it('should sort courts by price', () => {
        component.onSortChange('price');
        const filtered = component.filteredCourts();
        expect(filtered[0].price).toBe(100);
        expect(filtered[1].price).toBe(150);
    });

    it('should navigate to court details', () => {
        const mockCourt = { id: '1' } as any;
        component.onCourtClick(mockCourt);
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/court-details', '1']);
    });
});

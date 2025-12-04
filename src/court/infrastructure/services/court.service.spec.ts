import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { CourtService } from './court.service';
import { ConfigService } from '../../../shared/infrastructure/services/config.service';

describe('CourtService', () => {
    let service: CourtService;
    let httpMock: HttpTestingController;
    let configServiceSpy: jasmine.SpyObj<ConfigService>;

    beforeEach(() => {
        const cSpy = jasmine.createSpyObj('ConfigService', ['getApiUrl']);
        cSpy.getApiUrl.and.returnValue('http://localhost:3000/api');

        TestBed.configureTestingModule({
            providers: [
                CourtService,
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: ConfigService, useValue: cSpy }
            ]
        });

        service = TestBed.inject(CourtService);
        httpMock = TestBed.inject(HttpTestingController);
        configServiceSpy = TestBed.inject(ConfigService) as jasmine.SpyObj<ConfigService>;
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should fetch all courts', () => {
        const mockCourts = [{ id: '1', name: 'Court 1' }];

        service.getAllCourts().subscribe(courts => {
            expect(courts.length).toBe(1);
            expect(courts[0].name).toBe('Court 1');
        });

        const req = httpMock.expectOne('http://localhost:3000/api');
        expect(req.request.method).toBe('GET');
        req.flush(mockCourts);
    });

    it('should fetch court by id', () => {
        const mockCourt = { id: '1', name: 'Court 1' };

        service.getCourtById('1').subscribe(court => {
            expect(court.name).toBe('Court 1');
        });

        const req = httpMock.expectOne('http://localhost:3000/api/1');
        expect(req.request.method).toBe('GET');
        req.flush(mockCourt);
    });

    it('should search courts with filters', () => {
        service.searchCourts({ sport: 'tennis', minRating: 4 }).subscribe();

        const req = httpMock.expectOne(req => req.url === 'http://localhost:3000/api' && req.params.has('sport'));
        expect(req.request.params.get('sport')).toBe('tennis');
        expect(req.request.params.get('rating_gte')).toBe('4');
        req.flush([]);
    });
});

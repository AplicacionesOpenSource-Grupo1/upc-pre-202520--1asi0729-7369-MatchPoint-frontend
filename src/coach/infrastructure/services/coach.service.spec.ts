import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { CoachService } from './coach.service';
import { ConfigService } from '../../../shared/infrastructure/services/config.service';

describe('CoachService', () => {
    let service: CoachService;
    let httpMock: HttpTestingController;
    let configServiceSpy: jasmine.SpyObj<ConfigService>;

    beforeEach(() => {
        const cSpy = jasmine.createSpyObj('ConfigService', ['getApiUrl']);
        cSpy.getApiUrl.and.returnValue('http://localhost:3000/api');

        TestBed.configureTestingModule({
            providers: [
                CoachService,
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: ConfigService, useValue: cSpy }
            ]
        });

        service = TestBed.inject(CoachService);
        httpMock = TestBed.inject(HttpTestingController);
        configServiceSpy = TestBed.inject(ConfigService) as jasmine.SpyObj<ConfigService>;
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should fetch all coaches', () => {
        const mockCoaches = [{ id: '1', name: 'Coach 1' }];

        service.getAllCoaches().subscribe(coaches => {
            expect(coaches.length).toBe(1);
            expect(coaches[0].name).toBe('Coach 1');
        });

        const req = httpMock.expectOne('http://localhost:3000/api');
        expect(req.request.method).toBe('GET');
        req.flush(mockCoaches);
    });

    it('should fetch coach by id', () => {
        const mockCoach = { id: '1', name: 'Coach 1' };

        service.getCoachById('1').subscribe(coach => {
            expect(coach.name).toBe('Coach 1');
        });

        const req = httpMock.expectOne('http://localhost:3000/api/1');
        expect(req.request.method).toBe('GET');
        req.flush(mockCoach);
    });

    it('should search coaches with filters', () => {
        service.searchCoaches({ sport: 'tennis', level: 'expert' }).subscribe();

        const req = httpMock.expectOne(req => req.url === 'http://localhost:3000/api' && req.params.has('sports_like'));
        expect(req.request.params.get('sports_like')).toBe('tennis');
        expect(req.request.params.get('level')).toBe('expert');
        req.flush([]);
    });
});

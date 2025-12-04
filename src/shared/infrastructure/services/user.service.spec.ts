import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { ConfigService } from './config.service';

describe('UserService', () => {
    let service: UserService;
    let httpMock: HttpTestingController;
    let configServiceSpy: jasmine.SpyObj<ConfigService>;

    beforeEach(() => {
        const cSpy = jasmine.createSpyObj('ConfigService', ['getApiUrl']);
        cSpy.getApiUrl.and.returnValue('http://localhost:3000/api');

        TestBed.configureTestingModule({
            providers: [
                UserService,
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: ConfigService, useValue: cSpy }
            ]
        });

        service = TestBed.inject(UserService);
        httpMock = TestBed.inject(HttpTestingController);
        configServiceSpy = TestBed.inject(ConfigService) as jasmine.SpyObj<ConfigService>;
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should fetch user stats', () => {
        const mockStats = { totalBookings: 10, hoursPlayed: 20, favoriteSport: 'Tennis' };

        service.getUserStats('1').subscribe(stats => {
            expect(stats).toEqual(mockStats);
        });

        const req = httpMock.expectOne('http://localhost:3000/api/1/stats');
        expect(req.request.method).toBe('GET');
        req.flush(mockStats);
    });

    it('should fetch user activities', () => {
        const mockActivities = [{ id: '1', type: 'match', title: 'Match', description: 'desc', date: new Date(), icon: 'play' }];

        service.getUserActivities('1').subscribe(activities => {
            expect(activities.length).toBe(1);
            expect(activities[0].title).toBe('Match');
        });

        const req = httpMock.expectOne('http://localhost:3000/api/1/activities');
        expect(req.request.method).toBe('GET');
        req.flush(mockActivities);
    });
});

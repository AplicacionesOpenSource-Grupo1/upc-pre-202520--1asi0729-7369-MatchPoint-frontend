import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, from, Observable, of } from 'rxjs';
import { catchError, concatMap, map, switchMap, tap, toArray } from 'rxjs/operators';
import { ConfigService } from './config.service';

@Injectable({
    providedIn: 'root'
})
export class SeedService {
    private http = inject(HttpClient);
    private configService = inject(ConfigService);
    private apiUrl = this.configService.getApiUrl();

    private readonly targetUser = {
        id: "6bb2ed9b-e224-440f-be27-e96bcbe3c076",
        email: "juancarlosangulo@gmail.com",
        name: "juan carlos angulo",
        password: "password123",
        role: "user",
        avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop",
        favoriteSport: "Tennis",
        phone: "+51 999 999 999"
    };

    seed(): Observable<any> {
        return this.clearDatabase().pipe(
            switchMap(() => this.createUsers()),
            switchMap(() => this.createCourts()),
            switchMap((courts) => this.createCoaches().pipe(
                map(coaches => ({ courts, coaches }))
            )),
            switchMap(({ courts, coaches }) => this.createBookings(courts, coaches))
        );
    }

    private clearDatabase(): Observable<any> {
        // Helper to delete all items from an endpoint
        const deleteResources = (endpoint: string) => {
            return this.http.get<any[]>(`${this.apiUrl}/${endpoint}`).pipe(
                switchMap(items => {
                    if (!Array.isArray(items) || items.length === 0) return of([]);
                    return forkJoin(items.map(item =>
                        this.http.delete(`${this.apiUrl}/${endpoint}/${item.id}`).pipe(
                            catchError(() => of(null)) // Ignore errors if already deleted
                        )
                    ));
                })
            );
        };

        return forkJoin([
            deleteResources('bookings'),
            deleteResources('courts'),
            deleteResources('coaches'),
            deleteResources('users') // Be careful deleting users if auth depends on it, but we recreate the target user
        ]);
    }

    private createUsers(): Observable<any> {
        // Create the target user and maybe a few others
        const users = [
            this.targetUser,
            {
                id: "user-2",
                email: "maria@example.com",
                name: "Maria Garcia",
                password: "password123",
                role: "user",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
                favoriteSport: "Padel",
                phone: "+51 988 888 888"
            }
        ];

        return forkJoin(users.map(user => this.http.post(`${this.apiUrl}/users`, user)));
    }

    private createCourts(): Observable<any[]> {
        const courts = [
            {
                name: 'Club de Tenis Lima',
                location: 'Miraflores, Lima',
                price: 80.00,
                rating: 4.8,
                reviews: 120,
                description: 'Canchas de arcilla de primer nivel en el corazón de Miraflores. Mantenimiento diario y excelente iluminación nocturna.',
                amenities: ['Estacionamiento', 'Vestuarios', 'Cafetería', 'Iluminación LED', 'Gradas'],
                images: ['https://images.unsplash.com/photo-1622163642998-1ea36b1ad576?q=80&w=2070&auto=format&fit=crop'],
                availability: this.generateAvailability(),
                sport: 'Tennis',
                surface: 'Clay',
                capacity: 4,
                contact: { phone: '+51 999 888 777', email: 'contacto@clubtenislima.com', website: 'www.clubtenislima.com' }
            },
            {
                name: 'Padel Center Surco',
                location: 'Surco, Lima',
                price: 120.00,
                rating: 4.9,
                reviews: 85,
                description: 'Las mejores canchas de Padel techadas de Lima. Cristal panorámico y césped de última generación.',
                amenities: ['Techado', 'Alquiler de palas', 'Bar', 'WiFi', 'Tienda'],
                images: ['https://images.unsplash.com/photo-1626248901863-796d12647f2f?q=80&w=2070&auto=format&fit=crop'],
                availability: this.generateAvailability(),
                sport: 'Padel',
                surface: 'Artificial Grass',
                capacity: 4,
                contact: { phone: '+51 999 111 222', email: 'info@padelcenter.com' }
            },
            {
                name: 'Complejo Deportivo San Borja',
                location: 'San Borja, Lima',
                price: 60.00,
                rating: 4.5,
                reviews: 210,
                description: 'Canchas rápidas de tenis y polideportivo. Ideal para torneos y práctica casual.',
                amenities: ['Estacionamiento', 'Kiosko', 'Seguridad'],
                images: ['https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=2070&auto=format&fit=crop'],
                availability: this.generateAvailability(),
                sport: 'Tennis',
                surface: 'Hard Court',
                capacity: 4,
                contact: { phone: '+51 988 777 666', email: 'admin@sanborjadeportes.com' }
            },
            {
                name: 'La Molina Padel Club',
                location: 'La Molina, Lima',
                price: 140.00,
                rating: 4.7,
                reviews: 56,
                description: 'Club exclusivo de Padel con ambiente familiar y competitivo.',
                amenities: ['Restaurante', 'Piscina', 'Gym', 'Pro Shop'],
                images: ['https://plus.unsplash.com/premium_photo-1683836722608-80408501e7f6?q=80&w=2008&auto=format&fit=crop'],
                availability: this.generateAvailability(),
                sport: 'Padel',
                surface: 'Artificial Grass',
                capacity: 4,
                contact: { phone: '+51 977 666 555', email: 'reservas@molinapadel.com' }
            }
        ];

        // Use concatMap to ensure sequential creation if needed, or forkJoin for parallel
        return forkJoin(courts.map(court => this.http.post<any>(`${this.apiUrl}/courts`, court)));
    }

    private createCoaches(): Observable<any[]> {
        const coaches = [
            {
                name: 'Rafael Nadal (Coach)',
                location: 'San Isidro, Lima',
                pricePerHour: 150.00,
                rating: 5.0,
                reviews: 200,
                description: 'Entrenador profesional ex-ATP. Especialista en técnica y estrategia.',
                specialties: ['Técnica', 'Estrategia', 'Mental Game'],
                images: ['https://images.unsplash.com/photo-1530915536956-33a1699cd91c?q=80&w=2070&auto=format&fit=crop'],
                availability: this.generateCoachAvailability(),
                sports: ['Tennis'],
                experience: 15,
                certifications: ['ITF Level 3', 'PTR Professional'],
                languages: ['Español', 'English'],
                contact: { phone: '+51 987 654 321', email: 'rafa@coach.com' },
                level: 'professional'
            },
            {
                name: 'Maria Sharapova (Coach)',
                location: 'La Molina, Lima',
                pricePerHour: 130.00,
                rating: 4.9,
                reviews: 150,
                description: 'Entrenadora de alto rendimiento para Padel y Tenis.',
                specialties: ['Físico', 'Táctica', 'Niños'],
                images: ['https://images.unsplash.com/photo-1616406432452-07bc5938759d?q=80&w=2070&auto=format&fit=crop'],
                availability: this.generateCoachAvailability(),
                sports: ['Padel', 'Tennis'],
                experience: 10,
                certifications: ['Padel MBA', 'RPT National'],
                languages: ['Español', 'Russian', 'English'],
                contact: { phone: '+51 912 345 678', email: 'maria@coach.com' },
                level: 'advanced'
            },
            {
                name: 'Carlos Alcaraz (Coach)',
                location: 'Miraflores, Lima',
                pricePerHour: 100.00,
                rating: 4.8,
                reviews: 45,
                description: 'Entrenador joven y dinámico, enfocado en jugadores junior y competición.',
                specialties: ['Footwork', 'Potencia', 'Competición'],
                images: ['https://images.unsplash.com/photo-1626245347296-6b2223c2c4c2?q=80&w=2070&auto=format&fit=crop'],
                availability: this.generateCoachAvailability(),
                sports: ['Tennis'],
                experience: 5,
                certifications: ['RPT Level 1'],
                languages: ['Español'],
                contact: { phone: '+51 966 555 444', email: 'carlos@coach.com' },
                level: 'intermediate'
            }
        ];

        return forkJoin(coaches.map(coach => this.http.post<any>(`${this.apiUrl}/coaches`, coach)));
    }

    private createBookings(courts: any[], coaches: any[]): Observable<any> {
        const bookings = [];
        const today = new Date();

        // Booking 1: Today, Court 0
        bookings.push({
            userId: this.targetUser.id,
            courtId: courts[0].id,
            date: today.toISOString().split('T')[0],
            time: '10:00',
            duration: 60,
            status: 'confirmed',
            price: courts[0].price
        });

        // Booking 2: Tomorrow, Court 1
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        bookings.push({
            userId: this.targetUser.id,
            courtId: courts[1].id,
            date: tomorrow.toISOString().split('T')[0],
            time: '18:00',
            duration: 90,
            status: 'confirmed',
            price: courts[1].price * 1.5
        });

        // Booking 3: Day after tomorrow, Coach 0
        const dayAfter = new Date(today);
        dayAfter.setDate(dayAfter.getDate() + 2);
        bookings.push({
            userId: this.targetUser.id,
            coachId: coaches[0].id,
            date: dayAfter.toISOString().split('T')[0],
            time: '15:00',
            duration: 60,
            status: 'confirmed',
            price: coaches[0].pricePerHour
        });

        return forkJoin(bookings.map(booking => this.http.post(`${this.apiUrl}/bookings`, booking)));
    }

    private generateAvailability() {
        const slots = [];
        const times = ['08:00', '09:00', '10:00', '11:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
        for (const time of times) {
            slots.push({
                time,
                available: Math.random() > 0.3,
                price: 0
            });
        }
        return slots;
    }

    private generateCoachAvailability() {
        const slots = [];
        const times = ['08:00', '09:00', '10:00', '15:00', '16:00'];
        const today = new Date().toISOString().split('T')[0];
        for (const time of times) {
            slots.push({
                time,
                available: Math.random() > 0.2,
                price: 0,
                date: today
            });
        }
        return slots;
    }
}

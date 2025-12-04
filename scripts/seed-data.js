// Native fetch is available in Node 18+

const API_URL = 'http://localhost:8080/api/v1';
const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqdWFuY2FybG9zYW5ndWxvQGdtYWlsLmNvbSIsImlhdCI6MTc2NDg2MzYzMywiZXhwIjoxNzY0OTUwMDMzfQ.XCbyMdOCp1vsFbMXXeNQFQevpIBRng-EfCDtoloP8OE';
const USER_ID = '6bb2ed9b-e224-440f-be27-e96bcbe3c076';

const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${JWT_TOKEN}`
};

async function seed() {
    console.log('🌱 Starting database seeding...');

    try {
        // 1. Create Courts
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
                availability: generateAvailability(),
                sport: 'Tennis',
                surface: 'Clay',
                capacity: 4,
                contact: {
                    phone: '+51 999 888 777',
                    email: 'contacto@clubtenislima.com',
                    website: 'www.clubtenislima.com'
                }
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
                availability: generateAvailability(),
                sport: 'Padel',
                surface: 'Artificial Grass',
                capacity: 4,
                contact: {
                    phone: '+51 999 111 222',
                    email: 'info@padelcenter.com'
                }
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
                availability: generateAvailability(),
                sport: 'Tennis',
                surface: 'Hard Court',
                capacity: 4,
                contact: {
                    phone: '+51 988 777 666',
                    email: 'admin@sanborjadeportes.com'
                }
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
                availability: generateAvailability(),
                sport: 'Padel',
                surface: 'Artificial Grass',
                capacity: 4,
                contact: {
                    phone: '+51 977 666 555',
                    email: 'reservas@molinapadel.com'
                }
            }
        ];

        const createdCourts = [];
        for (const court of courts) {
            const res = await fetch(`${API_URL}/courts`, {
                method: 'POST',
                headers,
                body: JSON.stringify(court)
            });
            if (res.ok) {
                const data = await res.json();
                createdCourts.push(data);
                console.log(`✅ Created Court: ${data.name} (${data.id})`);
            } else {
                console.error(`❌ Failed to create court ${court.name}: ${res.status} ${res.statusText}`);
            }
        }

        // 2. Create Coaches
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
                availability: generateCoachAvailability(),
                sports: ['Tennis'],
                experience: 15,
                certifications: ['ITF Level 3', 'PTR Professional'],
                languages: ['Español', 'English'],
                contact: {
                    phone: '+51 987 654 321',
                    email: 'rafa@coach.com'
                },
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
                availability: generateCoachAvailability(),
                sports: ['Padel', 'Tennis'],
                experience: 10,
                certifications: ['Padel MBA', 'RPT National'],
                languages: ['Español', 'Russian', 'English'],
                contact: {
                    phone: '+51 912 345 678',
                    email: 'maria@coach.com'
                },
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
                availability: generateCoachAvailability(),
                sports: ['Tennis'],
                experience: 5,
                certifications: ['RPT Level 1'],
                languages: ['Español'],
                contact: {
                    phone: '+51 966 555 444',
                    email: 'carlos@coach.com'
                },
                level: 'intermediate'
            }
        ];

        const createdCoaches = [];
        for (const coach of coaches) {
            const res = await fetch(`${API_URL}/coaches`, {
                method: 'POST',
                headers,
                body: JSON.stringify(coach)
            });
            if (res.ok) {
                const data = await res.json();
                createdCoaches.push(data);
                console.log(`✅ Created Coach: ${data.name} (${data.id})`);
            } else {
                console.error(`❌ Failed to create coach ${coach.name}: ${res.status} ${res.statusText}`);
            }
        }

        // 3. Create Bookings
        if (createdCourts.length > 0) {
            const booking1 = {
                userId: USER_ID,
                courtId: createdCourts[0].id,
                date: new Date().toISOString().split('T')[0], // Today
                time: '10:00',
                duration: 60,
                status: 'confirmed',
                price: createdCourts[0].price
            };

            const res1 = await fetch(`${API_URL}/bookings`, {
                method: 'POST',
                headers,
                body: JSON.stringify(booking1)
            });
            if (res1.ok) {
                console.log(`✅ Created Booking for Court: ${createdCourts[0].name}`);
            } else {
                console.error(`❌ Failed to create court booking: ${res1.status}`);
                const text = await res1.text();
                console.error(text);
            }

            // Booking for tomorrow
            const booking2 = {
                userId: USER_ID,
                courtId: createdCourts[1].id,
                date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
                time: '18:00',
                duration: 90,
                status: 'confirmed',
                price: createdCourts[1].price * 1.5
            };

            const res2 = await fetch(`${API_URL}/bookings`, {
                method: 'POST',
                headers,
                body: JSON.stringify(booking2)
            });
            if (res2.ok) {
                console.log(`✅ Created Booking for Court: ${createdCourts[1].name}`);
            }
        }

        if (createdCoaches.length > 0) {
            const booking3 = {
                userId: USER_ID,
                coachId: createdCoaches[0].id,
                date: new Date(Date.now() + 172800000).toISOString().split('T')[0], // Day after tomorrow
                time: '15:00',
                duration: 60,
                status: 'confirmed',
                price: createdCoaches[0].pricePerHour
            };

            const res3 = await fetch(`${API_URL}/bookings`, {
                method: 'POST',
                headers,
                body: JSON.stringify(booking3)
            });
            if (res3.ok) {
                console.log(`✅ Created Booking for Coach: ${createdCoaches[0].name}`);
            } else {
                console.error(`❌ Failed to create coach booking: ${res3.status}`);
                const text = await res3.text();
                console.error(text);
            }
        }

    } catch (error) {
        console.error('❌ Seeding failed:', error);
    }
}

function generateAvailability() {
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

function generateCoachAvailability() {
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

seed();

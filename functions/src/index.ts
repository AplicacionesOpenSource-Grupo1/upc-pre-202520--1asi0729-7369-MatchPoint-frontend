import { onRequest } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions';

// Import mock data directly
const data = require('./data/db.json');

export const api = onRequest((req, res) => {
  // Set CORS headers
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  const path = req.path;
  const method = req.method;

  logger.info(`${method} ${path}`, { structuredData: true });

  try {
    // Users endpoints
    if (path === '/users' && method === 'GET') {
      res.json(data.users);
      return;
    }

    if (path.startsWith('/users/') && method === 'GET') {
      const id = path.split('/')[2];
      const user = data.users.find((u: any) => u.id === id);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json(user);
      return;
    }

    // Courts endpoints
    if (path === '/courts' && method === 'GET') {
      let filteredCourts = [...data.courts];

      // Apply filters
      if (req.query.sport && req.query.sport !== 'all') {
        filteredCourts = filteredCourts.filter((court: any) => 
          court.sport.toLowerCase() === req.query.sport?.toString().toLowerCase()
        );
      }

      if (req.query.location_like) {
        filteredCourts = filteredCourts.filter((court: any) => 
          court.location.toLowerCase().includes(req.query.location_like?.toString().toLowerCase() || '')
        );
      }

      if (req.query.rating_gte) {
        const minRating = parseFloat(req.query.rating_gte.toString());
        filteredCourts = filteredCourts.filter((court: any) => court.rating >= minRating);
      }

      if (req.query.price_lte) {
        const maxPrice = parseFloat(req.query.price_lte.toString());
        filteredCourts = filteredCourts.filter((court: any) => court.price <= maxPrice);
      }

      res.json(filteredCourts);
      return;
    }

    if (path.startsWith('/courts/') && method === 'GET') {
      const id = path.split('/')[2];
      const court = data.courts.find((c: any) => c.id === id);
      if (!court) {
        res.status(404).json({ error: 'Court not found' });
        return;
      }
      res.json(court);
      return;
    }

    // Coaches endpoints
    if (path === '/coaches' && method === 'GET') {
      let filteredCoaches = [...data.coaches];

      // Apply filters
      if (req.query.sports_like && req.query.sports_like !== 'all') {
        filteredCoaches = filteredCoaches.filter((coach: any) => 
          coach.sports.some((sport: string) => 
            sport.toLowerCase().includes(req.query.sports_like?.toString().toLowerCase() || '')
          )
        );
      }

      if (req.query.location_like && req.query.location_like !== 'any') {
        filteredCoaches = filteredCoaches.filter((coach: any) => 
          coach.location.toLowerCase().includes(req.query.location_like?.toString().toLowerCase() || '')
        );
      }

      if (req.query.level && req.query.level !== 'all') {
        filteredCoaches = filteredCoaches.filter((coach: any) => 
          coach.level === req.query.level?.toString()
        );
      }

      if (req.query.rating_gte) {
        const minRating = parseFloat(req.query.rating_gte.toString());
        filteredCoaches = filteredCoaches.filter((coach: any) => coach.rating >= minRating);
      }

      if (req.query.pricePerHour_lte) {
        const maxPrice = parseFloat(req.query.pricePerHour_lte.toString());
        filteredCoaches = filteredCoaches.filter((coach: any) => coach.pricePerHour <= maxPrice);
      }

      res.json(filteredCoaches);
      return;
    }

    if (path.startsWith('/coaches/') && method === 'GET') {
      const id = path.split('/')[2];
      const coach = data.coaches.find((c: any) => c.id === id);
      if (!coach) {
        res.status(404).json({ error: 'Coach not found' });
        return;
      }
      res.json(coach);
      return;
    }

    // Bookings endpoints
    if (path === '/bookings' && method === 'GET') {
      let filteredBookings = [...data.bookings];

      if (req.query.userId) {
        filteredBookings = filteredBookings.filter((booking: any) => 
          booking.userId === req.query.userId?.toString()
        );
      }

      res.json(filteredBookings);
      return;
    }

    if (path.startsWith('/bookings/') && method === 'GET') {
      const id = path.split('/')[2];
      const booking = data.bookings.find((b: any) => b.id === id);
      if (!booking) {
        res.status(404).json({ error: 'Booking not found' });
        return;
      }
      res.json(booking);
      return;
    }

    // Health check
    if (path === '/health' && method === 'GET') {
      res.json({ status: 'OK', timestamp: new Date().toISOString() });
      return;
    }

    // Default 404
    res.status(404).json({ error: 'Endpoint not found' });

  } catch (error) {
    logger.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

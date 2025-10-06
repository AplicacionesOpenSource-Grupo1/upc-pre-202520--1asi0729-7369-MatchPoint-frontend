export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  favoriteSpot: string;
}

export interface Booking {
  id: string;
  userId: string;
  courtId?: string;
  coachId?: string;
  date: string;
  time: string;
  duration: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  price: number;
}

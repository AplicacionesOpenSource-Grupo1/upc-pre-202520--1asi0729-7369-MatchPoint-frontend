export interface Coach {
  id: string;
  name: string;
  location: string;
  pricePerHour: number;
  rating: number;
  reviews: number;
  description: string;
  specialties: string[];
  images: string[];
  availability: CoachTimeSlot[];
  sports: string[];
  experience: number;
  certifications: string[];
  languages: string[];
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  level: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  availableCourts?: string[]; // IDs de las canchas donde puede trabajar el entrenador
}

export interface CoachTimeSlot {
  time: string;
  available: boolean;
  price: number;
  date: string;
}

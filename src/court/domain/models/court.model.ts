/**
 * Interfaz que define la estructura de una cancha deportiva
 * 
 * @interface Court
 * @author Juan Carlos Angulo
 * @version 1.0.0
 * @since 2025-10-06
 */
export interface Court {
  /** Identificador único de la cancha */
  id: string;
  /** Nombre de la cancha o complejo deportivo */
  name: string;
  /** Ubicación geográfica de la cancha */
  location: string;
  /** Precio por hora en la moneda local */
  price: number;
  /** Rating promedio de la cancha (0-5) */
  rating: number;
  /** Número total de reseñas recibidas */
  reviews: number;
  /** Descripción detallada de la cancha */
  description: string;
  /** Lista de amenidades disponibles en la cancha */
  amenities: string[];
  /** URLs de las imágenes de la cancha */
  images: string[];
  /** Horarios disponibles para reserva */
  availability: TimeSlot[];
  /** Tipo de deporte (tennis, padel, etc.) */
  sport: string;
  /** Tipo de superficie de la cancha */
  surface: string;
  /** Capacidad máxima de jugadores */
  capacity: number;
  /** Información de contacto de la cancha */
  contact: {
    /** Número de teléfono */
    phone: string;
    /** Dirección de email */
    email: string;
    /** Sitio web (opcional) */
    website?: string;
  };
  /** IDs de los entrenadores disponibles en esta cancha */
  availableCoaches?: string[];
}

/**
 * Interfaz que define un slot de tiempo disponible para reserva
 * 
 * @interface TimeSlot
 * @author Juan Carlos Angulo
 * @version 1.0.0
 * @since 2025-10-06
 */
export interface TimeSlot {
  /** Hora en formato HH:MM */
  time: string;
  /** Indica si el slot está disponible para reserva */
  available: boolean;
  /** Precio específico para este horario */
  price: number;
}

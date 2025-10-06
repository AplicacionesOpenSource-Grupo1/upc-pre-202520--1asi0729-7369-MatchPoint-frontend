/**
 * Interfaz que define la estructura de un usuario del sistema
 * 
 * @interface User
 * @author Juan Carlos Angulo
 * @version 1.0.0
 * @since 2025-10-06
 */
export interface User {
  /** Identificador único del usuario */
  id: string;
  /** Nombre completo del usuario */
  name: string;
  /** Dirección de correo electrónico */
  email: string;
  /** Número de teléfono */
  phone: string;
  /** Deporte favorito del usuario */
  favoriteSpot: string;
  /** URL del avatar del usuario (opcional) */
  avatar?: string;
  /** Estadísticas del usuario (opcional) */
  stats?: UserStats;
}

/**
 * Interfaz que define las estadísticas de un usuario
 * 
 * @interface UserStats
 * @author Juan Carlos Angulo
 * @version 1.0.0
 * @since 2025-10-06
 */
export interface UserStats {
  /** Número total de reservas realizadas */
  totalBookings: number;
  /** Total de horas jugadas */
  hoursPlayed: number;
  /** Deporte favorito basado en estadísticas */
  favoriteSport: string;
}

/**
 * Interfaz que define una actividad del usuario
 * 
 * @interface Activity
 * @author Juan Carlos Angulo
 * @version 1.0.0
 * @since 2025-10-06
 */
export interface Activity {
  /** Identificador único de la actividad */
  id: string;
  /** Tipo de actividad realizada */
  type: 'booking' | 'match' | 'cancellation';
  /** Título descriptivo de la actividad */
  title: string;
  /** Descripción detallada de la actividad */
  description: string;
  /** Fecha en que ocurrió la actividad */
  date: Date;
  /** Icono representativo de la actividad */
  icon: string;
}

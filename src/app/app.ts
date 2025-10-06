import { Component, signal, inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Layout } from '../shared/presentation/components/layout/layout';

@Component({
  selector: 'app-root',
  imports: [Layout],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('playmatch');
  private translate = inject(TranslateService);

  ngOnInit() {
    // Set translations manually
    this.setTranslations();
    
    // Set default language
    this.translate.setDefaultLang('en');
    
    // Try to use browser language or fallback to English
    const browserLang = this.translate.getBrowserLang();
    const languageToUse = browserLang?.match(/en|es/) ? browserLang : 'en';
    this.translate.use(languageToUse);
  }

  private setTranslations() {
    // English translations
    this.translate.setTranslation('en', {
      "dashboard": {
        "upcoming-bookings": "Upcoming Bookings",
        "no-bookings": "No upcoming bookings",
        "quick-actions": "Quick Actions",
        "find-court": "Find a Court",
        "find-coach": "Find a Coach",
        "dashboard": "Dashboard",
        "total-bookings": "Total Bookings",
        "hours-played": "Hours Played",
        "favorite-sport": "Favorite Sport",
        "recent-activity": "Recent Activity",
        "no-activities": "No recent activities"
      },
      "court-search": {
        "filters": "Filters",
        "sport": "Sport",
        "location": "Location",
        "location-placeholder": "Enter a city or zip code",
        "price-range": "Price Range",
        "min-rating": "Minimum Rating",
        "apply-filters": "Apply Filters",
        "search-placeholder": "Search for courts by name...",
        "available-courts": "Available Courts",
        "sort-by": "Sort by:",
        "sort-relevance": "Relevance",
        "sort-price": "Price",
        "sort-rating": "Rating",
        "no-results": "No courts found",
        "try-different-filters": "Try adjusting your search criteria or filters"
      },
      "coach-search": {
        "filters": "Filters",
        "sport": "Sport",
        "all-sports": "All Sports",
        "location": "Location",
        "any-location": "Any Location",
        "level": "Level",
        "all-levels": "All Levels",
        "beginner": "Beginner",
        "intermediate": "Intermediate", 
        "advanced": "Advanced",
        "rating": "Rating",
        "search-placeholder": "Search coaches by name or specialty",
        "search": "Search",
        "coaches-count": "Coaches ({{count}})",
        "sort-by": "Sort by:",
        "sort-rating": "Rating",
        "sort-price": "Price",
        "sort-availability": "Availability",
        "coach": "Coach",
        "no-coaches-found": "No coaches found matching your criteria"
      },
      "court-details": {
        "back-to-search": "Back to Search",
        "reviews": "reviews",
        "sport": "Sport",
        "surface": "Surface",
        "capacity": "Players",
        "from-price": "From",
        "amenities": "Amenities",
        "contact": "Contact Information",
        "book-now": "Book Now",
        "select-date": "Select Date",
        "available-times": "Available Times",
        "no-slots-available": "No time slots available for this date",
        "price-from": "Price from",
        "final-price-note": "*Final price may vary based on selected time slot",
        "not-found": "Court not found",
        "booking-confirmed": "Booking confirmed for {{time}} on {{date}}",
        "booking-error": "Error processing booking. Please try again."
      },
      "coach-details": {
        "back-to-search": "Back to Search",
        "reviews": "reviews",
        "years-experience": "Years Experience",
        "level": "Level",
        "sports": "Sports",
        "per-hour": "per hour",
        "specialties": "Specialties",
        "certifications": "Certifications",
        "languages": "Languages",
        "contact": "Contact Information",
        "book-session": "Book Session",
        "select-date": "Select Date",
        "available-times": "Available Times",
        "no-slots-available": "No time slots available for this date",
        "price-from": "Price from",
        "final-price-note": "*Final price may vary based on selected time slot",
        "not-found": "Coach not found",
        "booking-confirmed": "Session booked for {{time}} on {{date}}",
        "booking-error": "Error processing booking. Please try again."
      },
      "sport": {
        "tennis": "Tennis",
        "padel": "Padel", 
        "basketball": "Basketball",
        "pickleball": "Pickleball"
      },
      "nav": {
        "home": "Home",
        "search-courts": "Search Courts",
        "search-coaches": "Search Coaches",
        "my-bookings": "My Bookings",
        "profile": "Profile"
      },
      "footer": {
        "description": "Connect with sports enthusiasts, find courts, book coaches, and enjoy your favorite sports.",
        "quick-links": "Quick Links",
        "support": "Support",
        "pricing": "Pricing",
        "help-center": "Help Center",
        "contact": "Contact",
        "privacy-policy": "Privacy Policy",
        "terms-of-service": "Terms of Service",
        "rights-reserved": "All rights reserved."
      }
    });

    // Spanish translations
    this.translate.setTranslation('es', {
      "dashboard": {
        "upcoming-bookings": "Próximas Reservas",
        "no-bookings": "No hay próximas reservas",
        "quick-actions": "Acciones Rápidas",
        "find-court": "Buscar Cancha",
        "find-coach": "Buscar Entrenador",
        "dashboard": "Panel de Control",
        "total-bookings": "Total de Reservas",
        "hours-played": "Horas Jugadas",
        "favorite-sport": "Deporte Favorito",
        "recent-activity": "Actividad Reciente",
        "no-activities": "No hay actividades recientes"
      },
      "court-search": {
        "filters": "Filtros",
        "sport": "Deporte",
        "location": "Ubicación",
        "location-placeholder": "Ingresa una ciudad o código postal",
        "price-range": "Rango de Precio",
        "min-rating": "Calificación Mínima",
        "apply-filters": "Aplicar Filtros",
        "search-placeholder": "Buscar canchas por nombre...",
        "available-courts": "Canchas Disponibles",
        "sort-by": "Ordenar por:",
        "sort-relevance": "Relevancia",
        "sort-price": "Precio",
        "sort-rating": "Calificación",
        "no-results": "No se encontraron canchas",
        "try-different-filters": "Intenta ajustar tus criterios de búsqueda o filtros"
      },
      "coach-search": {
        "filters": "Filtros",
        "sport": "Deporte",
        "all-sports": "Todos los Deportes",
        "location": "Ubicación",
        "any-location": "Cualquier Ubicación",
        "level": "Nivel",
        "all-levels": "Todos los Niveles",
        "beginner": "Principiante",
        "intermediate": "Intermedio",
        "advanced": "Avanzado",
        "rating": "Calificación",
        "search-placeholder": "Buscar entrenadores por nombre o especialidad",
        "search": "Buscar",
        "coaches-count": "Entrenadores ({{count}})",
        "sort-by": "Ordenar por:",
        "sort-rating": "Calificación",
        "sort-price": "Precio",
        "sort-availability": "Disponibilidad",
        "coach": "Entrenador",
        "no-coaches-found": "No se encontraron entrenadores que coincidan con tus criterios"
      },
      "court-details": {
        "back-to-search": "Volver a Búsqueda",
        "reviews": "reseñas",
        "sport": "Deporte",
        "surface": "Superficie",
        "capacity": "Jugadores",
        "from-price": "Desde",
        "amenities": "Comodidades",
        "contact": "Información de Contacto",
        "book-now": "Reservar Ahora",
        "select-date": "Seleccionar Fecha",
        "available-times": "Horarios Disponibles",
        "no-slots-available": "No hay horarios disponibles para esta fecha",
        "price-from": "Precio desde",
        "final-price-note": "*El precio final puede variar según el horario seleccionado",
        "not-found": "Cancha no encontrada",
        "booking-confirmed": "Reserva confirmada para las {{time}} el {{date}}",
        "booking-error": "Error al procesar la reserva. Inténtalo de nuevo."
      },
      "coach-details": {
        "back-to-search": "Volver a Búsqueda",
        "reviews": "reseñas",
        "years-experience": "Años de Experiencia",
        "level": "Nivel",
        "sports": "Deportes",
        "per-hour": "por hora",
        "specialties": "Especialidades",
        "certifications": "Certificaciones",
        "languages": "Idiomas",
        "contact": "Información de Contacto",
        "book-session": "Reservar Sesión",
        "select-date": "Seleccionar Fecha",
        "available-times": "Horarios Disponibles",
        "no-slots-available": "No hay horarios disponibles para esta fecha",
        "price-from": "Precio desde",
        "final-price-note": "*El precio final puede variar según el horario seleccionado",
        "not-found": "Entrenador no encontrado",
        "booking-confirmed": "Sesión reservada para las {{time}} el {{date}}",
        "booking-error": "Error al procesar la reserva. Inténtalo de nuevo."
      },
      "sport": {
        "tennis": "Tenis",
        "padel": "Pádel",
        "basketball": "Baloncesto",
        "pickleball": "Pickleball"
      },
      "nav": {
        "home": "Inicio",
        "search-courts": "Buscar Canchas",
        "search-coaches": "Buscar Entrenadores",
        "my-bookings": "Mis Reservas",
        "profile": "Perfil"
      },
      "footer": {
        "description": "Conecta con entusiastas del deporte, encuentra canchas, reserva entrenadores y disfruta de tus deportes favoritos.",
        "quick-links": "Enlaces Rápidos",
        "support": "Soporte",
        "pricing": "Precios",
        "help-center": "Centro de Ayuda",
        "contact": "Contacto",
        "privacy-policy": "Política de Privacidad",
        "terms-of-service": "Términos de Servicio",
        "rights-reserved": "Todos los derechos reservados."
      }
    });
  }
}

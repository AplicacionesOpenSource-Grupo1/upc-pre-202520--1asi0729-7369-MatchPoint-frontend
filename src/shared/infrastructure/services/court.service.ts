import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Court } from '../../domain/models/court.model';
import { ConfigService } from './config.service';

/**
 * Servicio para la gestión de canchas deportivas
 * 
 * Proporciona métodos para:
 * - Obtener listado de canchas disponibles
 * - Buscar canchas específicas por ID
 * - Filtrar canchas según criterios de búsqueda
 * 
 * @author Juan Carlos Angulo
 * @version 1.0.0
 * @since 2025-10-06
 */
@Injectable({
  providedIn: 'root'
})
export class CourtService {
  /** Cliente HTTP para realizar peticiones a la API */
  private http = inject(HttpClient);
  /** Servicio de configuración */
  private configService = inject(ConfigService);

  /**
   * Obtiene todas las canchas disponibles
   * @returns {Observable<Court[]>} Observable con el array de todas las canchas
   */
  getAllCourts(): Observable<Court[]> {
    return this.http.get<Court[]>(this.configService.getApiUrl('courts'));
  }

  /**
   * Obtiene una cancha específica por su ID
   * @param {string} id - ID único de la cancha
   * @returns {Observable<Court>} Observable con los datos de la cancha
   */
  getCourtById(id: string): Observable<Court> {
    return this.http.get<Court>(`${this.configService.getApiUrl('courts')}/${id}`);
  }

  /**
   * Busca canchas aplicando filtros específicos
   * Utiliza parámetros de consulta para filtrar los resultados
   * @param {Object} filters - Objeto con los filtros a aplicar
   * @param {string} [filters.sport] - Tipo de deporte (tennis, padel, etc.)
   * @param {string} [filters.location] - Ubicación de la cancha (búsqueda parcial)
   * @param {number} [filters.minRating] - Rating mínimo requerido
   * @param {number} [filters.maxPrice] - Precio máximo por hora
   * @returns {Observable<Court[]>} Observable con el array de canchas filtradas
   */
  searchCourts(filters?: {
    sport?: string;
    location?: string;
    minRating?: number;
    maxPrice?: number;
  }): Observable<Court[]> {
    let params = new URLSearchParams();
    
    if (filters) {
      if (filters.sport) params.append('sport', filters.sport);
      if (filters.location) params.append('location_like', filters.location);
      if (filters.minRating) params.append('rating_gte', filters.minRating.toString());
      if (filters.maxPrice) params.append('price_lte', filters.maxPrice.toString());
    }

    const baseUrl = this.configService.getApiUrl('courts');
    const url = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
    return this.http.get<Court[]>(url);
  }
}

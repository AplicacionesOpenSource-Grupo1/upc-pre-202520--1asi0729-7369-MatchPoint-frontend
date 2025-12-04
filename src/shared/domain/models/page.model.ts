/**
 * Interfaz genérica para respuestas paginadas del backend
 * 
 * @interface Page
 * @template T Tipo de objeto contenido en la página
 */
export interface Page<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

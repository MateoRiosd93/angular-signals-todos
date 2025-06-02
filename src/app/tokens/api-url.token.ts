import { InjectionToken } from "@angular/core";
import { environment } from "../../environments/environment";

// Usar un InjectionToken en Angular para manejar configuraciones
// como la apiUrl es la mejor manera por razones sólidas 
// de arquitectura, testeo y mantenimiento.
export const API_URL = new InjectionToken<string>('API_URL', {
    providedIn: 'root',
    factory: () => environment.BASE_URL
})
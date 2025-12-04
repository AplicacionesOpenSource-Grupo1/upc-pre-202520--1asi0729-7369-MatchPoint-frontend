import { Injectable } from '@angular/core';

export interface AppConfig {
  production: boolean;
  apiBaseUrl: string;
  apiPort: number;
  apiTimeout: number;
  appName: string;
  appVersion: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: AppConfig;

  constructor() {
    this.config = this.loadConfig();
  }

  private loadConfig(): AppConfig {
    // En Angular, las variables de entorno se configuran en build time
    // Por eso usamos diferentes archivos de environment para cada entorno
    return {
      production: this.isProduction(),
      apiBaseUrl: this.getApiBaseUrl(),
      apiPort: this.resolveApiPort(),
      apiTimeout: this.getApiTimeout(),
      appName: 'PlayMatch',
      appVersion: '1.0.0'
    };
  }

  private isProduction(): boolean {
    return typeof window !== 'undefined' &&
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1';
  }

  private getApiBaseUrl(): string {
    // 1. Prioridad: Variable de entorno explícita (para Docker, Prod, o Dev custom)
    const envApiUrl = this.getEnvVar('API_BASE_URL');
    if (envApiUrl) {
      return envApiUrl.endsWith('/api/v1') ? envApiUrl : `${envApiUrl}/api/v1`;
    }

    // 2. Fallback: Localhost con puerto dinámico (solo si no hay env var)
    if (typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      const port = this.resolveApiPort();
      return `http://localhost:${port}/api/v1`;
    }

    // 3. Producción default (si no hay env var y no es localhost)
    if (this.isProduction()) {
      return 'https://matchpoint-front.web.app/api/v1';
    } else {
      const port = this.resolveApiPort();
      return `http://localhost:${port}/api/v1`;
    }
  }

  private resolveApiPort(): number {
    // Intentar obtener el puerto de las variables de entorno
    const envPort = this.getEnvVar('API_PORT');
    if (envPort) {
      const port = parseInt(envPort, 10);
      if (!isNaN(port) && port > 0) {
        return port;
      }
    }

    // Puerto por defecto según el entorno
    return this.isProduction() ? 443 : 3000;
  }

  private getApiTimeout(): number {
    const timeout = this.getEnvVar('API_TIMEOUT');
    return timeout ? parseInt(timeout, 10) : (this.isProduction() ? 15000 : 10000);
  }

  private getEnvVar(key: string): string | undefined {
    if (typeof window !== 'undefined' && (window as any).env) {
      return (window as any).env[key];
    }
    return undefined;
  }

  get(): AppConfig {
    return this.config;
  }

  getApiUrl(endpoint: string = ''): string {
    const baseUrl = this.config.apiBaseUrl;
    return endpoint ? `${baseUrl}/${endpoint.replace(/^\//, '')}` : baseUrl;
  }

  isProductionMode(): boolean {
    return this.config.production;
  }

  getApiPort(): number {
    return this.config.apiPort;
  }
}

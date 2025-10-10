import { Injectable } from '@angular/core';

export interface AppConfig {
  production: boolean;
  apiBaseUrl: string;
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
    if (this.isProduction()) {
      // En producción, usar la URL de Firebase Functions
      return this.getEnvVar('API_BASE_URL') || 'https://matchpoint-front.web.app/api';
    } else {
      // En desarrollo, usar localhost
      return this.getEnvVar('API_BASE_URL') || 'http://localhost:3001';
    }
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
}

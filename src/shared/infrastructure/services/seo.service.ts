import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoData {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private title = inject(Title);
  private meta = inject(Meta);

  private readonly siteName = 'PlayMatch';
  private readonly defaultImage = 'https://matchpoint-front.web.app/assets/images/logo.png';
  private readonly defaultUrl = 'https://matchpoint-front.web.app';

  /**
   * Actualiza los meta tags de SEO para la página actual
   */
  updateSeoTags(seoData: SeoData): void {
    // Actualizar título
    this.title.setTitle(`${seoData.title} | ${this.siteName}`);

    // Meta tags básicos
    this.updateMetaTag('description', seoData.description);
    if (seoData.keywords) {
      this.updateMetaTag('keywords', seoData.keywords);
    }

    // Open Graph (Facebook, LinkedIn, etc.)
    this.updateMetaTag('og:title', `${seoData.title} | ${this.siteName}`, 'property');
    this.updateMetaTag('og:description', seoData.description, 'property');
    this.updateMetaTag('og:image', seoData.image || this.defaultImage, 'property');
    this.updateMetaTag('og:url', seoData.url || this.defaultUrl, 'property');
    this.updateMetaTag('og:type', seoData.type || 'website', 'property');
    this.updateMetaTag('og:site_name', this.siteName, 'property');

    // Twitter Cards
    this.updateMetaTag('twitter:card', 'summary_large_image', 'name');
    this.updateMetaTag('twitter:site', '@PlayMatch', 'name');
    this.updateMetaTag('twitter:title', `${seoData.title} | ${this.siteName}`, 'name');
    this.updateMetaTag('twitter:description', seoData.description, 'name');
    this.updateMetaTag('twitter:image', seoData.image || this.defaultImage, 'name');

    // Canonical URL
    this.updateCanonicalUrl(seoData.url || this.defaultUrl);
  }

  /**
   * Actualiza o crea un meta tag
   */
  private updateMetaTag(name: string, content: string, attribute: string = 'name'): void {
    if (this.meta.getTag(`${attribute}="${name}"`)) {
      this.meta.updateTag({ [attribute]: name, content });
    } else {
      this.meta.addTag({ [attribute]: name, content });
    }
  }

  /**
   * Actualiza la URL canónica
   */
  private updateCanonicalUrl(url: string): void {
    let link: HTMLLinkElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    
    link.setAttribute('href', url);
  }

  /**
   * Configuraciones predefinidas para diferentes páginas
   */
  static readonly SEO_CONFIG = {
    dashboard: {
      title: 'Dashboard',
      description: 'Tu centro de control personal en PlayMatch. Gestiona tus reservas, encuentra nuevos oponentes y mejora tu juego.',
      keywords: 'dashboard, reservas, tenis, padel, deportes, PlayMatch'
    },
    login: {
      title: 'Iniciar Sesión',
      description: 'Accede a tu cuenta de PlayMatch y disfruta de la mejor experiencia deportiva.',
      keywords: 'login, iniciar sesión, cuenta, PlayMatch, deportes'
    },
    register: {
      title: 'Crear Cuenta',
      description: 'Únete a PlayMatch y descubre la mejor plataforma para encontrar canchas y entrenadores deportivos.',
      keywords: 'registro, crear cuenta, únete, PlayMatch, deportes, tenis, padel'
    },
    courts: {
      title: 'Buscar Canchas',
      description: 'Encuentra las mejores canchas de tenis y padel cerca de ti. Reserva fácilmente en PlayMatch.',
      keywords: 'canchas, tenis, padel, reservar, deportes, PlayMatch'
    },
    coaches: {
      title: 'Buscar Entrenadores',
      description: 'Conecta con entrenadores profesionales de tenis y padel. Mejora tu técnica con los mejores.',
      keywords: 'entrenadores, coaches, tenis, padel, clases, PlayMatch'
    },
    settings: {
      title: 'Configuración',
      description: 'Personaliza tu experiencia en PlayMatch. Ajusta tu perfil y preferencias.',
      keywords: 'configuración, perfil, ajustes, PlayMatch'
    }
  };
}

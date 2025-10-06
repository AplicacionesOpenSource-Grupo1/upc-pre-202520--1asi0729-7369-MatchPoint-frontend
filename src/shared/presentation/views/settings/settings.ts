import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../infrastructure/services/user.service';
import { User } from '../../../domain/models/user.model';

/**
 * Interfaz extendida para la configuración de usuario
 * Incluye campos adicionales no presentes en el modelo base User
 * @interface UserSettings
 * @extends User
 */
interface UserSettings extends User {
  /** Fecha de nacimiento del usuario */
  dateOfBirth?: string;
  /** Género del usuario */
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  /** Dirección del usuario */
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

/**
 * Tipos de pestañas disponibles en la configuración
 * @type SettingsTab
 */
type SettingsTab = 'personal' | 'history' | 'plan' | 'notifications';

/**
 * Componente para la gestión de configuración y preferencias del usuario
 * 
 * Permite a los usuarios:
 * - Actualizar información personal
 * - Ver historial de reservas
 * - Gestionar plan de suscripción
 * - Configurar notificaciones
 * - Guardar cambios en tiempo real
 * 
 * @author Juan Carlos Angulo
 * @version 1.0.0
 * @since 2025-10-06
 */
@Component({
  selector: 'app-settings',
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Settings {
  /** Servicio para operaciones relacionadas con usuarios */
  private userService = inject(UserService);

  /** Signal para la pestaña activa en la interfaz */
  activeTab = signal<SettingsTab>('personal');
  /** Signal que indica si los datos están cargando */
  isLoading = signal(false);
  /** Signal que indica si se está guardando información */
  isSaving = signal(false);
  /** Signal que indica si el guardado fue exitoso */
  saveSuccess = signal(false);
  /** Signal para mensajes de error durante el guardado */
  saveError = signal<string | null>(null);
  /** Signal que contiene toda la configuración del usuario */
  userSettings = signal<UserSettings>({
    id: '1',
    name: 'Juan Pérez',
    email: 'juan@example.com',
    phone: '+51 987 654 321',
    favoriteSpot: 'tennis',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDISOJtVPso5ffmcKrUOvjtSvdPu8caoAOQpqj3eMymGxGCbr5nYFX_ZzVrCCZ4GSXBt-cMq3hSQ7jbVGVJGaCEz8ezBIUzLpbh-9tF-yF2JYS9DeztFjk_WHfkZ_exXhXkxzCsBUPiiPRaIAiJl-nfOo6Kx0AXDOvJBDp-OK8b2ihJZ3N5gLHb1X4LnGg30xHQ2Mtum_PQXE1ADbgIWL511kEBMl3NeqRMyfjXuP6-sQ6D-gru3qGi7n3yQJA-iC4j5H9nZf47CFlZ',
    dateOfBirth: '1990-01-01',
    gender: 'Male',
    address: {
      street: '',
      city: 'Lima',
      state: 'Lima',
      zipCode: ''
    }
  });

  /**
   * Constructor del componente
   * Inicializa la carga de configuración del usuario
   */
  constructor() {
    this.loadUserSettings();
  }

  /**
   * Carga la configuración del usuario desde la API
   * Actualiza el estado de carga durante la operación
   * @private
   */
  private loadUserSettings(): void {
    this.isLoading.set(true);
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.userSettings.update(current => ({
          ...current,
          ...user
        }));
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading user settings:', error);
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Cambia la pestaña activa en la interfaz
   * @param {SettingsTab} tab - Nueva pestaña a mostrar
   */
  setActiveTab(tab: SettingsTab): void {
    this.activeTab.set(tab);
  }

  /**
   * Guarda los cambios de configuración en la API
   * Maneja estados de carga, éxito y error
   */
  onSave(): void {
    this.isSaving.set(true);
    this.saveError.set(null);
    this.saveSuccess.set(false);
    
    const currentSettings = this.userSettings();
    const userData: Partial<User> = {
      name: currentSettings.name,
      email: currentSettings.email,
      phone: currentSettings.phone,
      favoriteSpot: currentSettings.favoriteSpot,
      avatar: currentSettings.avatar
    };

    this.userService.updateUser(currentSettings.id, userData).subscribe({
      next: (updatedUser) => {
        this.userSettings.update(current => ({
          ...current,
          ...updatedUser
        }));
        this.isSaving.set(false);
        this.saveSuccess.set(true);
        console.log('Settings saved successfully:', updatedUser);
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          this.saveSuccess.set(false);
        }, 3000);
      },
      error: (error) => {
        console.error('Error saving settings:', error);
        this.isSaving.set(false);
        this.saveError.set('Error al guardar los ajustes. Por favor, inténtalo de nuevo.');
        
        // Hide error message after 5 seconds
        setTimeout(() => {
          this.saveError.set(null);
        }, 5000);
      }
    });
  }

  /**
   * Método de conveniencia que llama a onSave()
   * Utilizado por el botón de guardar en el template
   */
  saveSettings(): void {
    this.onSave();
  }

  /**
   * Actualiza un campo específico de la configuración del usuario
   * @param {keyof UserSettings} field - Campo a actualizar
   * @param {any} value - Nuevo valor para el campo
   */
  updateUserSettings(field: keyof UserSettings, value: any): void {
    this.userSettings.update(current => ({
      ...current,
      [field]: value
    }));
  }

  /**
   * Actualiza un campo específico de la dirección del usuario
   * @param {keyof NonNullable<UserSettings['address']>} field - Campo de dirección a actualizar
   * @param {string} value - Nuevo valor para el campo de dirección
   */
  updateAddress(field: keyof NonNullable<UserSettings['address']>, value: string): void {
    this.userSettings.update(current => ({
      ...current,
      address: {
        ...current.address!,
        [field]: value
      }
    }));
  }
}

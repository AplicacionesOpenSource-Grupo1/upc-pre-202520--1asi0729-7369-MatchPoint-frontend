import { Component, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-language',
  imports: [CommonModule],
  templateUrl: './language.html',
  styleUrl: './language.css'
})
export class Language {
  private translate = inject(TranslateService);

  currentLanguage = this.translate.currentLang || 'en';

  switchLanguage(language: string) {
    this.translate.use(language);
    this.currentLanguage = language;
  }
}

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
    
    // Set default language
    this.translate.setDefaultLang('en');
    
    // Try to use browser language or fallback to English
    const browserLang = this.translate.getBrowserLang();
    const languageToUse = browserLang?.match(/en|es/) ? browserLang : 'en';
    this.translate.use(languageToUse);
  }

}

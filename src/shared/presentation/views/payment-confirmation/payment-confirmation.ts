import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {MatCard} from '@angular/material/card';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-payment-confirmation',
  imports: [
    MatCard,
    TranslatePipe
  ],
  templateUrl: 'payment-confirmation.html',
  styleUrl: 'payment-confirmation.css'
})

export class PaymentConfirmation {
  private router = inject(Router);

  /** Regresa al usuario devuelta a la pagina principal    **/
  navigateHome(): void{
    this.router.navigate(['/']).then();
  }
}

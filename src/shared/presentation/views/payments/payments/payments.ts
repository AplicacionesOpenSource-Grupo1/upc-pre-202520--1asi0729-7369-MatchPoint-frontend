import {Component, inject, model} from '@angular/core';
import {MatCard} from '@angular/material/card';
import {MatFormField} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatDivider} from '@angular/material/divider';
import {Router} from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-payments',
  imports: [
    MatCard,
    MatFormField,
    MatInput,
    MatButton,
    MatDivider,
    ReactiveFormsModule
  ],
  templateUrl: './payments.html',
  styleUrl: './payments.css',
  }
)

export class Payments {
  private router = inject(Router);
/**Comprueba si se realizo un submit**/

  /**Formulario a rellenar**/
  cForm = new FormGroup({
    card: new FormControl('',[Validators.required, Validators.maxLength(16)]),
    year: new FormControl('',[Validators.required, Validators.maxLength(2)]),
    month: new FormControl('',[Validators.required, Validators.maxLength(2)]),
    cvc: new FormControl('',[Validators.required, Validators.maxLength(3)]),
  })

  /** Getters **/
  get card() {
    return this.cForm.get('card');
  }

  get year() {
    return this.cForm.get('year');
  }

  get month() {
    return this.cForm.get('month');
  }

  get cvc() {
    return this.cForm.get('cvc');
  }


  /** Confirmación de envio**/

  onSubmit(){
    if(this.cForm.valid) {
      console.log('Se completo el pago', this.cForm.value);
      this.router.navigate(['/payments/confirmation']).then();
    }
    else
      console.log('Se cancelo el pago');
  }

}

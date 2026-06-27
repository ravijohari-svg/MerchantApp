import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-register',
  imports: [ButtonModule, CardModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {}

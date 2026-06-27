import { Component } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../shared/material/material.module';

@Component({
  selector: 'app-dashboard',
  imports: [MATERIAL_IMPORTS],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {}

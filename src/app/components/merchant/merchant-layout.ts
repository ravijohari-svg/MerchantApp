import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { Header } from '../../shared/components/header/header';

@Component({
  selector: 'app-merchant-layout',
  imports: [RouterOutlet, Header, Sidebar],
  templateUrl: './merchant-layout.html',
  styleUrl: './merchant-layout.scss',
})
export class MerchantLayout {}

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { Header } from '../../shared/components/header/header';

@Component({
  selector: 'app-inventory-layout',
  imports: [RouterOutlet, Header, Sidebar],
  templateUrl: './inventory-layout.html',
  styleUrl: './inventory-layout.scss',
})
export class InventoryLayout {}

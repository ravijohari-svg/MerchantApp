import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-store-management',
  imports: [],
  templateUrl: './store-management.html',
  styleUrl: './store-management.scss',
})
export class StoreManagement {

  hierarchy = [
    {
      name: 'Sector 55',
      manager: 'Priya M.',
      active: true
    },
    {
      name: 'Sector 29',
      manager: 'Arjun S.',
      active: true
    },
    {
      name: 'Cyber Hub',
      manager: 'Deepa K.',
      active: true
    },
    {
      name: 'DLF Phase 3',
      manager: 'Unassigned',
      active: false
    }
  ];

  stores = [
    {
      name: 'KFC - Sector 55',
      type: 'Restaurant',
      active: true,
      orders: 234,
      revenue: '₹1,82,400',
      rating: 4.7,
      delivery: 'Drone',
      icon: '🍔',
      team: ['RK','PM','SP']
    },
    {
      name: 'KFC - Sector 29',
      type: 'Restaurant',
      active: true,
      orders:198,
      revenue:'₹1,54,200',
      rating:4.5,
      delivery:'Drone',
      icon:'🍔',
      team:['RK','AS','SP']
    },
    {
      name:'KFC - Cyber Hub',
      type:'Restaurant',
      active:true,
      orders:312,
      revenue:'₹2,43,600',
      rating:4.8,
      delivery:'Drone',
      icon:'🍔',
      team:['RK','DK','KN']
    },
    {
      name:'KFC - DLF Phase 3',
      type:'Restaurant',
      active:false,
      orders:89,
      revenue:'₹69,300',
      rating:4.2,
      delivery:'',
      icon:'🍔',
      team:['RK','VR']
    },
    {
      name:'MedPlus - Sector 55',
      type:'Pharmacy',
      active:true,
      orders:156,
      revenue:'₹1,21,800',
      rating:4.6,
      delivery:'Drone',
      icon:'💊',
      team:['RK','PM','SP']
    },
    {
      name:'D-Mart - Sector 29',
      type:'Grocery',
      active:true,
      orders:267,
      revenue:'₹2,08,200',
      rating:4.4,
      delivery:'',
      icon:'🛒',
      team:['RK','AS','SP']
    }
  ];

  constructor(private router: Router) {}

  goToAddStore() {
  this.router.navigate(['merchant/add-store']);
}

}
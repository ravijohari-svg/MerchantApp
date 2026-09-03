import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface KpiCard {
  title: string;
  value: number;
  icon: string;
  iconColor: string;
}

interface ActiveOrder {
  id: string;
  customerName: string;
  itemsCount: number;
  timeElapsed: string;
  status: 'Preparing' | 'Pending';
  actionLabel: 'Ready' | 'Accept';
}

interface SystemNotification {
  message: string;
  time: string;
  type: 'alert' | 'info' | 'reminder';
}

@Component({
  selector: 'app-staff-dashboard',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './staff-dashboard.html',
  styleUrl: './staff-dashboard.scss',
})

export class StaffDashboard implements OnInit {

  kpis: KpiCard[] = [
    { title: 'My Orders', value: 14, icon: 'shopping_cart', iconColor: '#2b6cb0' },
    { title: 'Pending', value: 4, icon: 'schedule', iconColor: '#dd6b20' },
    { title: 'Preparing', value: 6, icon: 'schedule', iconColor: '#805ad5' },
    { title: 'Completed Today', value: 24, icon: 'check_circle', iconColor: '#38a169' }
  ];

  activeOrders: ActiveOrder[] = [
    { 
      id: 'ORD-7833', 
      customerName: 'Kavitha Nair', 
      itemsCount: 2, 
      timeElapsed: '1 hr ago', 
      status: 'Preparing', 
      actionLabel: 'Ready' 
    },
    { 
      id: 'ORD-7832', 
      customerName: 'Deepak Rao', 
      itemsCount: 3, 
      timeElapsed: '1.5 hr ago', 
      status: 'Pending', 
      actionLabel: 'Accept' 
    }
  ];

  notifications: SystemNotification[] = [
    { message: 'New order #ORD-7841 assigned to you', time: '2 min ago', type: 'alert' },
    { message: 'Order #ORD-7833 — customer requesting extra sauce', time: '18 min ago', type: 'info' },
    { message: 'Store closes at 11:00 PM tonight', time: '1 hr ago', type: 'reminder' },
    { message: 'Paracetamol is running low — notify manager', time: '3 hrs ago', type: 'alert' }
  ];

  constructor() {}

  ngOnInit(): void {}

  handleAction(order: ActiveOrder) {
    console.log(`Action "${order.actionLabel}" clicked for ${order.id}`);
  }
}
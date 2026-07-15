import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface KpiCard {
  title: string;
  value: number;
  icon: string;
  iconColor: string;
  bgColor: string;
}

interface InventoryAlert {
  productName: string;
  productIcon: string;
  sku: string;
  category: string;
  currentStock: number;
  maxStock: number;
  urgency: 'Critical' | 'Warning' | 'Out of Stock';
}

interface RecentUpdate {
  type: 'Restocked' | 'Consumed';
  item: string;
  user: string;
  time: string;
  quantity: number;
}

@Component({
  selector: 'app-inventory-dashboard',
 imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './inventory-dashboard.html',
  styleUrl: './inventory-dashboard.scss',
})

export class InventoryDashboard implements OnInit {
  
  kpis: KpiCard[] = [
    { title: 'Total Products', value: 248, icon: 'inventory_2', iconColor: '#1e88e5', bgColor: '#e3f2fd' },
    { title: 'Low Stock', value: 6, icon: 'warning', iconColor: '#ffb300', bgColor: '#fff8e1' },
    { title: 'Out of Stock', value: 10, icon: 'cancel', iconColor: '#e53935', bgColor: '#ffebee' },
    { title: 'Restocked Today', value: 14, icon: 'check_circle', iconColor: '#43a047', bgColor: '#e8f5e9' }
  ];

  displayedColumns: string[] = ['product', 'sku', 'category', 'currentStock', 'stockLevel', 'urgency', 'action'];
  
  alertsDataSource: InventoryAlert[] = [
    { productName: 'Paracetamol 500mg', productIcon: 'pill', sku: 'MED-042', category: 'Pharmacy', currentStock: 12, maxStock: 500, urgency: 'Critical' },
    { productName: 'realme Buds T100', productIcon: 'headphones', sku: 'REL-BT1', category: 'Electronics', currentStock: 3, maxStock: 50, urgency: 'Critical' },
    { productName: 'Samsung Galaxy S24', productIcon: 'smartphone', sku: 'SAM-S24', category: 'Electronics', currentStock: 8, maxStock: 30, urgency: 'Warning' },
    { productName: 'Basmati Rice 5kg', productIcon: 'grass', sku: 'GRO-188', category: 'Grocery', currentStock: 14, maxStock: 200, urgency: 'Warning' },
    { productName: 'Vicks VapoRub 50g', productIcon: 'wash', sku: 'MED-012', category: 'Pharmacy', currentStock: 0, maxStock: 100, urgency: 'Out of Stock' },
    { productName: 'Lays Classic 26g', productIcon: 'fastfood', sku: 'GRO-045', category: 'Grocery', currentStock: 11, maxStock: 300, urgency: 'Warning' }
  ];

  recentUpdates: RecentUpdate[] = [
    { type: 'Restocked', item: 'McSpicy Burger', user: 'Suresh Patel', time: '18 min ago', quantity: 150 },
    { type: 'Consumed', item: 'Chicken Biryani', user: 'System', time: '1 hr ago', quantity: -45 },
    { type: 'Restocked', item: 'Basmati Rice 5kg', user: 'Suresh Patel', time: '3 hrs ago', quantity: 80 }
  ];

  constructor() {}

  ngOnInit(): void {}

  getStockPercentage(current: number, max: number): number {
    if (max === 0) return 0;
    return (current / max) * 100;
  }

  onUpdateInventory() {
    console.log('Update Inventory clicked');
  }

  onRestock(item: InventoryAlert) {
    console.log(`Restock triggered for: ${item.productName}`);
  }
}
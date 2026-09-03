import { Component, signal } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../shared/material/material.module';
import { DecimalPipe, CurrencyPipe, NgClass } from '@angular/common';

interface KpiCard {
  id: string;
  label: string;
  value: string;
  change: string;
  changeType: 'up' | 'down' | 'neutral' | 'warning' | 'danger';
  subtext: string;
  icon: string;
  theme: 'blue' | 'purple' | 'orange' | 'green' | 'yellow' | 'red';
}

interface StorePerformance {
  name: string;
  emoji: string;
  category: 'Restaurant' | 'Pharmacy' | 'Grocery';
  orders: number;
  revenue: number;
  rating: number;
  drone: 'On' | 'Off';
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MATERIAL_IMPORTS , DecimalPipe, NgClass],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  protected readonly currentDate = signal('Sunday, 19 June 2024 · KFC India - 6 stores');

  selectedTimeRange = signal<'7D' | '1M' | '3M'>('7D');

  isRefreshing = signal(false);

  kpiCards: KpiCard[] = [
    {
      id: 'revenue',
      label: 'Revenue Today',
      value: '₹71,240',
      change: '+12.4%',
      changeType: 'up',
      subtext: 'vs yesterday ₹63,400',
      icon: 'pi pi-dollar',
      theme: 'blue',
    },
    {
      id: 'orders',
      label: 'Total Orders',
      value: '212',
      change: '+8.1%',
      changeType: 'up',
      subtext: 'vs yesterday 196',
      icon: 'pi pi-shopping-cart',
      theme: 'purple',
    },
    {
      id: 'stores',
      label: 'Active Stores',
      value: '5 / 6',
      change: '-1',
      changeType: 'down',
      subtext: '1 store offline',
      icon: 'pi pi-home',
      theme: 'orange',
    },
    {
      id: 'drones',
      label: 'Drone Deliveries',
      value: '148',
      change: '+23.5%',
      changeType: 'up',
      subtext: 'vs yesterday 120',
      icon: 'pi pi-send',
      theme: 'green',
    },
    {
      id: 'pending',
      label: 'Pending Orders',
      value: '18',
      change: '+3',
      changeType: 'warning',
      subtext: 'require attention',
      icon: 'pi pi-clock',
      theme: 'yellow',
    },
    {
      id: 'alerts',
      label: 'Low Stock Alerts',
      value: '7',
      change: '+2',
      changeType: 'danger',
      subtext: 'products to restock',
      icon: 'pi pi-exclamation-triangle',
      theme: 'red',
    },
  ];

  // Store Performance Data
  storesPerformance: StorePerformance[] = [
    {
      name: 'KFC – Sector 55',
      emoji: '🍔',
      category: 'Restaurant',
      orders: 234,
      revenue: 182400,
      rating: 4.7,
      drone: 'On',
      status: 'Active',
    },
    {
      name: 'KFC – Sector 29',
      emoji: '🍔',
      category: 'Restaurant',
      orders: 198,
      revenue: 154200,
      rating: 4.5,
      drone: 'On',
      status: 'Active',
    },
    {
      name: 'KFC – Cyber Hub',
      emoji: '🍔',
      category: 'Restaurant',
      orders: 312,
      revenue: 243600,
      rating: 4.8,
      drone: 'On',
      status: 'Active',
    },
    {
      name: 'KFC – DLF Phase 3',
      emoji: '🍔',
      category: 'Restaurant',
      orders: 89,
      revenue: 69300,
      rating: 4.2,
      drone: 'Off',
      status: 'Inactive',
    },
    {
      name: 'MedPlus – Sector 55',
      emoji: '💊',
      category: 'Pharmacy',
      orders: 156,
      revenue: 121800,
      rating: 4.6,
      drone: 'On',
      status: 'Active',
    },
    {
      name: 'D-Mart – Sector 29',
      emoji: '🛒',
      category: 'Grocery',
      orders: 267,
      revenue: 208200,
      rating: 4.4,
      drone: 'Off',
      status: 'Active',
    },
  ];

  orderStatusDistribution = {
    total: 212,
    categories: [
      { name: 'Delivered', count: 148, percentage: 70, color: '#10b981' }, // Green
      { name: 'Pending', count: 18, percentage: 8, color: '#0ea5e9' }, // Blue
      { name: 'Preparing', count: 39, percentage: 18, color: '#f59e0b' }, // Yellow/Orange
      { name: 'Cancelled', count: 7, percentage: 4, color: '#ef4444' }, // Red
    ]
  };


  productColumns = [
    'product',
    'sku',
    'category',
    'units',
    'revenue',
    'stock'
  ];

  topProducts = [
    {
      icon: '🍔',
      name: 'McSpicy Burger',
      sku: 'KFC-001',
      category: 'Food',
      units: 248,
      revenue: '₹37,200',
      stock: 85
    },
    {
      icon: '💊',
      name: 'Paracetamol 500mg',
      sku: 'MED-042',
      category: 'Pharmacy',
      units: 312,
      revenue: '₹9,360',
      stock: 12
    },
    {
      icon: '📱',
      name: 'Samsung Galaxy S24',
      sku: 'SAM-S24',
      category: 'Electronics',
      units: 34,
      revenue: '₹8,49,966',
      stock: 8
    },
    {
      icon: '🌾',
      name: 'Basmati Rice 5kg',
      sku: 'GRO-188',
      category: 'Grocery',
      units: 167,
      revenue: '₹41,750',
      stock: 46
    },
    {
      icon: '🍛',
      name: 'Chicken Biryani',
      sku: 'KFC-089',
      category: 'Food',
      units: 189,
      revenue: '₹56,700',
      stock: 99
    }
  ];

  //==========================
  // Orders
  //==========================

  orderColumns = [
    'id',
    'customer',
    'store',
    'amount',
    'status',
    'time'
  ];

  orders = [
    {
      id: 'ORD-7841',
      customer: 'Priya Sharma',
      initial: 'P',
      color: '#3559b7',
      store: 'KFC - Sector 55',
      amount: '₹847',
      status: 'Delivered',
      statusClass: 'delivered',
      time: '2 min ago'
    },
    {
      id: 'ORD-7840',
      customer: 'Arjun Mehta',
      initial: 'A',
      color: '#8064ff',
      store: 'MedPlus - DLF Phase',
      amount: '₹420',
      status: 'In Transit',
      statusClass: 'transit',
      time: '8 min ago'
    },
    {
      id: 'ORD-7839',
      customer: 'Sneha Gupta',
      initial: 'S',
      color: '#10b981',
      store: 'D-Mart - Sector 29',
      amount: '₹2,340',
      status: 'Preparing',
      statusClass: 'preparing',
      time: '15 min ago'
    },
    {
      id: 'ORD-7838',
      customer: 'Rohit Verma',
      initial: 'R',
      color: '#f59e0b',
      store: 'KFC - Cyber Hub',
      amount: '₹650',
      status: 'Accepted',
      statusClass: 'accepted',
      time: '22 min ago'
    },
    {
      id: 'ORD-7837',
      customer: 'Anjali Singh',
      initial: 'A',
      color: '#ef4444',
      store: 'Samsung - Sector 5',
      amount: '₹12,999',
      status: 'Delivered',
      statusClass: 'delivered',
      time: '34 min ago'
    },
    {
      id: 'ORD-7836',
      customer: 'Vikash Kumar',
      initial: 'V',
      color: '#3b82f6',
      store: 'MedPlus - Cyber Hub',
      amount: '₹890',
      status: 'Cancelled',
      statusClass: 'cancelled',
      time: '45 min ago'
    }
  ];

  //==========================
  // Quick Actions
  //==========================

  actions = [
    {
      icon: 'add',
      title: 'Add Product'
    },
    {
      icon: 'store',
      title: 'New Store'
    },
    {
      icon: 'local_offer',
      title: 'Create Coupon'
    },
    {
      icon: 'shopping_cart',
      title: 'View Orders'
    }
  ];

  //==========================
  // Notifications
  //==========================

  notifications = [
    {
      message: 'New order #ORD-7841 from Priya Sharma (₹847)',
      time: '2 min ago'
    },
    {
      message: 'Paracetamol stock low - only 12 units left',
      time: '15 min ago'
    },
    {
      message: 'Drone dispatched for #ORD-7840',
      time: '8 min ago'
    },
    {
      message: 'Settlement of ₹1,24,500 processed',
      time: '1 hr ago'
    },
    {
      message: 'KFC DLF Phase 3 went offline',
      time: '2 hrs ago'
    }
  ];

  refreshDashboard() {
    this.isRefreshing.set(true);
    setTimeout(() => {
      this.isRefreshing.set(false);
      console.log('Dashboard data refreshed!');
    }, 800);
  }

  exportReport() {
    console.log('Exporting PDF/Excel report...');
    alert('Export Report initiated! Your download will begin shortly.');
  }

  setTimeRange(range: '7D' | '1M' | '3M') {
    this.selectedTimeRange.set(range);
  }
}

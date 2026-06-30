import { Component, signal } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../shared/material/material.module';
import { DecimalPipe, CurrencyPipe } from '@angular/common';

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
  imports: [MATERIAL_IMPORTS, DecimalPipe],
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

  import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import Chart from 'chart.js/auto';

interface KpiCard {
  title: string;
  value: string | number;
  subtext: string;
  trend: string;
  trendPositive: boolean;
  icon: string;
  iconColor: string;
}

interface InventoryItem {
  name: string;
  sku: string;
  stock: number;
  status: 'Low Stock' | 'Out of Stock';
}

interface Order {
  id: string;
  customer: string;
  avatarColor: string;
  items: number;
  amount: number;
  status: 'Delivered' | 'Preparing' | 'Pending';
  time: string;
}

@Component({
  selector: 'app-store-dashboard',
  imports: [CommonModule, MatCardModule, MatTableModule, MatIconModule, MatButtonModule],
  templateUrl: './store-dashboard.html',
  styleUrl: './store-dashboard.scss',
})

export class StoreDashboard implements OnInit, AfterViewInit {
  @ViewChild('revenueChart') revenueChartRef!: ElementRef;
  
  kpis: KpiCard[] = [
    { title: "Today's Revenue", value: '₹24,100', subtext: 'vs yesterday', trend: '+9.2%', trendPositive: true, icon: 'attach_money', iconColor: '#1e88e5' },
    { title: 'Orders Today', value: 72, subtext: 'vs yesterday 68', trend: '+6.1%', trendPositive: true, icon: 'shopping_cart', iconColor: '#7b1fa2' },
    { title: 'Pending Orders', value: 8, subtext: 'require action', trend: '+2', trendPositive: false, icon: 'schedule', iconColor: '#f57c00' },
    { title: 'Store Rating', value: '4.8', subtext: 'based on 234 reviews', trend: '+0.1%', trendPositive: true, icon: 'star_border', iconColor: '#fbc02d' }
  ];

  inventoryAlerts: InventoryItem[] = [
    { name: 'Paracetamol 500mg', sku: 'MED-042', stock: 12, status: 'Low Stock' },
    { name: 'Vicks VapoRub', sku: 'MED-012', stock: 0, status: 'Out of Stock' },
    { name: 'realme Buds T100', sku: 'REL-BT1', stock: 3, status: 'Low Stock' }
  ];

  displayedColumns: string[] = ['customer', 'items', 'amount', 'status', 'time'];
  ordersDataSource: Order[] = [
    { id: 'ORD-7841', customer: 'Priya Sharma', avatarColor: '#1a237e', items: 3, amount: 847, status: 'Delivered', time: '2 min ago' },
    { id: 'ORD-7837', customer: 'Anjali Singh', avatarColor: '#6a1b9a', items: 1, amount: 12999, status: 'Delivered', time: '34 min ago' },
    { id: 'ORD-7833', customer: 'Kavitha Nair', avatarColor: '#00695c', items: 2, amount: 490, status: 'Preparing', time: '1 hr ago' },
    { id: 'ORD-7832', customer: 'Deepak Rao', avatarColor: '#ef6c00', items: 3, amount: 640, status: 'Pending', time: '1.5 hr ago' }
  ];

  chartLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  chartData = [14000, 13000, 16000, 15000, 21000, 25000, 23000];

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initChart();
  }

  initChart() {
    const ctx = this.revenueChartRef.nativeElement.getContext('2d');
    
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(0, 171, 85, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 171, 85, 0.0)');

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.chartLabels,
        datasets: [{
          label: 'Revenue',
          data: this.chartData,
          borderColor: '#00ab55',
          borderWidth: 3,
          fill: true,
          backgroundColor: gradient,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#919eab' } },
          y: {
            min: 0,
            max: 28000,
            ticks: {
              stepSize: 7000,
              color: '#919eab',
              callback: (value) => '₹' + (Number(value) / 1000) + 'K'
            },
            grid: { color: 'rgba(145, 158, 171, 0.1)' }
          }
        }
      }
    });
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('');
  }
}
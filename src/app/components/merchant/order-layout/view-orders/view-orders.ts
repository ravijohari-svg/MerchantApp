
  import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

export type FlowState = 'PENDING_ACCEPTANCE' | 'SELECT_TIME' | 'PREPARING_STEPS' | 'WAITING_DRONE';

interface OrderItem {
  name: string;
  qty: number;
  notes: string;
  price: number;
  image: string;
}

@Component({
  selector: 'app-view-orders',
     imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './view-orders.html',
  styleUrl: './view-orders.scss',
})
export class ViewOrders implements OnDestroy {
  orderId = '#ORD-98231';
  orderTime = 'Placed today at 12:45 PM';

  currentStatus: FlowState = 'PENDING_ACCEPTANCE';

  items: OrderItem[] = [
    { name: 'Garden Fresh Salad Bowl', qty: 1, notes: 'No onions', price: 14.50, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=100&q=80' },
    { name: 'Premium Cheese Burger', qty: 1, notes: 'Medium Well', price: 18.00, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&q=80' }
  ];

  customer = {
    name: 'Elena Rodriguez',
    tier: 'Silver Tier Member',
    phone: '+1 (555) 012-3456',
    email: 'e.rodriguez@email.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80'
  };

  delivery = {
    address: '123 Main St\nNew York, NY 10001',
    estimatedTime: '20-30 mins',
    instructions: '“Leave at the front door and ring the bell once.”'
  };

  summary = {
    subtotal: 32.50,
    tax: 2.88,
    deliveryFee: 4.99,
    total: 40.37,
    paymentMethod: 'Visa •••• 4242'
  };

  timeOptions: string[] = ['10 min', '15 min', '20 min', 'Custom'];
  selectedTimeOption: string = '20 min';
  customTimeMinutes: number = 25;
  countdownMinutes: number = 20;
  private timerInterval: any;

  tasks = { preparing: true, packing: false, qualityCheck: false };
  showReadyModal: boolean = false;

  acceptOrder(): void { this.currentStatus = 'SELECT_TIME'; }
  rejectOrder(): void { console.log('Order rejected'); }
  incrementTime(): void { this.customTimeMinutes++; }
  decrementTime(): void { if (this.customTimeMinutes > 1) this.customTimeMinutes--; }

  startPreparing(): void {
    this.countdownMinutes = this.selectedTimeOption === 'Custom' ? this.customTimeMinutes : parseInt(this.selectedTimeOption, 10);
    this.tasks.preparing = true;
    this.currentStatus = 'PREPARING_STEPS';
    this.startTimer();
  }

  triggerUpdateTime(): void {
    this.clearInterval();
    this.currentStatus = 'SELECT_TIME';
  }

  private startTimer(): void {
    this.clearInterval();
    this.timerInterval = setInterval(() => {
      if (this.countdownMinutes > 1) this.countdownMinutes--;
      else this.clearInterval();
    }, 60000);
  }

  private clearInterval(): void { if (this.timerInterval) clearInterval(this.timerInterval); }

  get isReadyForPickupDisabled(): boolean {
    return !(this.tasks.preparing && this.tasks.packing && this.tasks.qualityCheck);
  }

  openReadyModal(): void { this.showReadyModal = true; }
  closeReadyModal(): void { this.showReadyModal = false; }
  confirmReady(): void {
    this.clearInterval();
    this.showReadyModal = false;
    this.currentStatus = 'WAITING_DRONE';
  }

  ngOnDestroy(): void { this.clearInterval(); }
}
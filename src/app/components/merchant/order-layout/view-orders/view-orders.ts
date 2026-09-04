
import { Component, OnDestroy, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { MerchantService } from '../../../../services/merchant.service';

export type FlowState = 'PENDING_ACCEPTANCE' | 'SELECT_TIME' | 'PREPARING_STEPS' | 'Waiting';

interface OrderItem {
  name: string;
  qty: number;
  notes: string;
  price: number;
  image: string;
  sku?: string;
  productId?: string;
}

@Component({
  selector: 'app-view-orders',
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './view-orders.html',
  styleUrl: './view-orders.scss',
})
export class ViewOrders implements OnInit, OnDestroy {
  private merchantService = inject(MerchantService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private location = inject(Location);

  private targetOrderId: string | null = null;

  orderId = '';
  orderTime = '';

  currentStatus: FlowState = 'PENDING_ACCEPTANCE';

  items: OrderItem[] = [];

  customer = {
    name: '',
    tier: 'Regular Customer',
    phone: '',
    email: '',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80'
  };

  delivery = {
    address: '',
    estimatedTime: '20-30 mins',
    instructions: ''
  };

  summary = {
    subtotal: 0,
    tax: 0,
    otherCharges: 0,
    deliveryFee: 0,
    total: 0,
    paymentMethod: ''
  };

  timeOptions: string[] = ['10 min', '15 min', '20 min', 'Custom'];
  selectedTimeOption: string = '20 min';
  customTimeMinutes: number = 25;
  countdownMinutes: number = 20;
  private timerInterval: any;

  tasks = { preparing: true, packing: false, qualityCheck: false };
  showReadyModal: boolean = false;
  isAccepting: boolean = false;
  showAcceptSuccessModal: boolean = false;

  ngOnInit() {
    console.log('ViewOrders initialized, calling fetchOrders...');
    this.targetOrderId = this.route.snapshot.paramMap.get('id');
    this.fetchOrders();
  }

  fetchOrders() {
    let merchantId = 'MERC-98765';
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const parsedToken = JSON.parse(token);
        merchantId = parsedToken?.merchantBrand?.MerchantId || parsedToken.merchantId || parsedToken.MerchantId || parsedToken.id || 'MERC-98765';
      }
    } catch (e) {
      console.warn('Could not parse token from localStorage');
    }

    const payload = { MerchantId: merchantId };
    console.log('Sending request to fetch orders with payload:', payload);

    this.merchantService.getMerchantOrders(payload).subscribe({
      next: (response: any) => {
        console.log('Received response from API:', response);
        let res = response;
        if (typeof response === 'string') {
          res = JSON.parse(response);
        } else if (response && response.body && typeof response.body === 'string') {
          res = JSON.parse(response.body);
        } else if (response && response.body && typeof response.body === 'object') {
          res = response.body;
        }

        const data = res?.orders || res?.data || res;

        if (Array.isArray(data) && data.length > 0) {
          let orderData = null;
          if (this.targetOrderId) {
            orderData = data.find((o: any) => o.OrderId === this.targetOrderId || o.id === this.targetOrderId || o.orderId === this.targetOrderId);
          } else {
            orderData = data[0]; // fallback to first order
          }

          if (orderData) {
            console.log('Mapping order data:', orderData);
            this.mapOrderData(orderData);
          } else {
            console.log('Order not found for ID:', this.targetOrderId);
          }
        } else {
          console.log('Response data is empty or invalid.');
        }
        this.cdr.detectChanges(); // Force view to update
      },
      error: (err) => {
        console.error('Error fetching orders from API:', err);
      }
    });
  }

  mapOrderData(data: any) {
    if (data.OrderStatus === 'CREATED') {
      this.currentStatus = 'PENDING_ACCEPTANCE';
    } else if (data.OrderStatus === 'ACCEPTED') {
      this.currentStatus = 'SELECT_TIME';
    } else {
      this.currentStatus = 'Waiting';
    }

    this.orderId = data.OrderId ? `#${data.OrderId}` : '';
    if (data.TS_Created) {
      const date = new Date(data.TS_Created);
      this.orderTime = `Placed on ${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }

    if (data.Items && data.Items.length > 0) {
      this.items = data.Items.map((item: any) => {
        const attributesVals = item.Attributes ? Object.values(item.Attributes).filter(Boolean) : [];
        return {
          name: item.Name,
          qty: item.Qty,
          notes: attributesVals.length > 0 ? attributesVals.join(', ') : '',
          price: item.Amount,
          image: item.image || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=100&q=80',
          sku: item.Sku,
          productId: item.ProductId
        };
      });
    }

    if (data.Customer) {
      this.customer.name = data.Customer.Name || '';
      this.customer.phone = data.Customer.Phone || '';
      this.customer.email = data.Customer.Email || '';
    }

    if (data.DeliveryAddress) {
      const addr = data.DeliveryAddress;
      const addrLines = [addr.AddressLine1, addr.AddressLine2].filter(Boolean).join('\n');
      const cityState = [addr.City, addr.State].filter(Boolean).join(', ');
      this.delivery.address = `${addrLines}\n${cityState} ${addr.PinCode || ''}`.trim();
      this.delivery.instructions = addr.Instructions ? `“${addr.Instructions}”` : '';
    }

    if (data.Pricing) {
      this.summary.subtotal = data.Pricing.Subtotal || 0;
      this.summary.tax = data.Pricing.TaxAmount || 0;
      this.summary.otherCharges = data.Pricing.OtherCharges || 0;
      this.summary.deliveryFee = data.Pricing.DeliveryFee || 0;
      this.summary.total = data.Pricing.TotalAmount || 0;
    }

    if (data.Payment && data.Payment.PaymentMethod) {
      this.summary.paymentMethod = data.Payment.PaymentMethod;
    }
  }

  acceptOrder(): void {
    if (this.isAccepting) return;
    this.isAccepting = true;
    let merchantId = 'MERC-98765';
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const parsedToken = JSON.parse(token);
        merchantId = parsedToken?.merchantBrand?.MerchantId || parsedToken.merchantId || parsedToken.MerchantId || parsedToken.id || 'MERC-98765';
      }
    } catch (e) {}

    const payload = {
      OrderId: this.orderId.replace('#', ''),
      Action: "ACCEPTANCE_MERCHANT",
      Payload: {
        Status: "ACCEPTED",
        AcceptedBy: merchantId,
        RejectedReason: null
      }
    };

    this.merchantService.updateOrder(payload).subscribe({
      next: (res: any) => {
        console.log('Order accepted successfully', res);
        this.isAccepting = false;
        this.showAcceptSuccessModal = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error accepting order', err);
        this.isAccepting = false;
        // Proceed anyway for now as fallback
        this.currentStatus = 'SELECT_TIME';
        this.cdr.detectChanges();
      }
    });
  }
  
  closeAcceptSuccessModal(): void {
    this.showAcceptSuccessModal = false;
    this.currentStatus = 'SELECT_TIME';
  }
  
  goBack(): void {
    this.location.back();
  }
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
    this.currentStatus = 'Waiting';
  }

  ngOnDestroy(): void { this.clearInterval(); }
}
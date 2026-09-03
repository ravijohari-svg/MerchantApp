import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

export type TabType = 'profile' | 'security' | 'notifications' | 'integrations';

export interface IntegrationItem {
  id: string;
  title: string;
  description: string;
  connected: boolean;
}

@Component({
  selector: 'app-settings',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})

export class Settings {
  activeTab: TabType = 'profile';

  profileForm: FormGroup;
  securityForm: FormGroup;
  notificationsForm: FormGroup;

  integrations: IntegrationItem[] = [
    { id: 'gmaps', title: 'Google Maps', description: 'Store location and delivery zone mapping', connected: true },
    { id: 'razorpay', title: 'Razorpay', description: 'Payment gateway for online transactions', connected: true },
    { id: 'twilio', title: 'Twilio SMS', description: 'Automated order notifications via SMS', connected: true },
    { id: 'whatsapp', title: 'WhatsApp Business', description: 'Order status updates via WhatsApp', connected: false },
    { id: 'zoho', title: 'Zoho Inventory', description: 'Sync product inventory with Zoho', connected: false }
  ];

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      businessName: ['KFC India', [Validators.required, Validators.minLength(2)]],
      ownerName: ['Ravi Kumar Sharma', [Validators.required, Validators.minLength(2)]],
      email: ['merchant@kfc.in', [Validators.required, Validators.email]],
      mobile: ['+9198765 43210', [Validators.required, Validators.pattern(/^\+?[0-9\s-]{10,15}$/)]],
      gstNumber: ['07AABCK1296Q1Z9', [Validators.required, Validators.pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)]],
      panNumber: ['AABCK1296Q', [Validators.required, Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)]]
    });

    this.securityForm = this.fb.group({
      twoFactor: [true],
      loginNotifications: [true],
      sessionTimeout: [false]
    });

    this.notificationsForm = this.fb.group({
      newOrder: [true],
      orderStatus: [true],
      orderCancellation: [true],
      settlementProcessed: [true],
      paymentFailures: [true],
      refundRequests: [true],
      lowStockAlerts: [true],
      droneDeliveryUpdates: [true],
      storeOfflineAlerts: [true]
    });
  }

  setTab(tab: TabType): void {
    this.activeTab = tab;
  }

  onSaveProfile(): void {
    if (this.profileForm.valid) {
      console.log('Profile Data Saved:', this.profileForm.value);
      alert('Business profile changes saved successfully!');
    } else {
      this.profileForm.markAllAsTouched();
    }
  }

  toggleIntegration(item: IntegrationItem): void {
    item.connected = !item.connected;
  }

  isFieldInvalid(form: FormGroup, field: string): boolean {
    const control = form.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
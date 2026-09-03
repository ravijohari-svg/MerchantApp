import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MerchantService } from '../../../services/merchant.service';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-store-management',
  imports: [MatProgressSpinnerModule],
  templateUrl: './store-management.html',
  styleUrl: './store-management.scss',
})
export class StoreManagement implements OnInit {

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

  stores: any[] = [];
  isLoading: boolean = true;

  constructor(private router: Router, private merchantService: MerchantService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.isLoading = true;
    let merchantId = 'MB00013'; // Fallback
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const parsedToken = JSON.parse(token);
        merchantId = parsedToken?.merchantBrand?.MerchantId || parsedToken.merchantId || parsedToken.MerchantId || parsedToken.id || 'MB00013';
      }
    } catch (e) {
      console.warn('Could not parse token from localStorage');
    }

    this.merchantService.getStores(merchantId).subscribe({
      next: (response: any) => {
        console.log('API Response:', response);

        // Handle case where AWS API gateway returns stringified body
        let res = response;
        if (typeof response === 'string') {
          res = JSON.parse(response);
        } else if (response && response.body && typeof response.body === 'string') {
          res = JSON.parse(response.body);
        } else if (response && response.body && typeof response.body === 'object') {
          res = response.body;
        }

        const dataList = Array.isArray(res) ? res : (res?.stores || res?.data);

        if (dataList && Array.isArray(dataList)) {
          this.stores = dataList.map((store: any) => {
            return {
              name: store.StoreName || 'Unnamed Store',
              type: store.StoreType === 'MEDICINE' ? 'Pharmacy' : (store.StoreType === 'GROCERY' ? 'Grocery' : 'Restaurant'),
              active: store.Status === 'ACTIVE' || store.StoreStatus === 'OPEN',
              orders: store.orders || store.Orders || '--',
              revenue: store.revenue || store.Revenue || '--',
              rating: store.rating || store.Rating || '--',
              delivery: store.StoreConfiguration?.EnableDroneDelivery ? 'Drone' : '',
              icon: store.StoreType === 'MEDICINE' ? '💊' : (store.StoreType === 'GROCERY' ? '🛒' : '🍔'),
              contactNumber: store.ContactInfo?.StoreContactNumber || store.ContactInfo?.CustomerSupportNumber || 'N/A',
              managerName: store.ContactInfo?.PrimaryManagerName || 'N/A',
              openingTime: store.OperatingHours?.OpeningTime || '--:--',
              closingTime: store.OperatingHours?.ClosingTime || '--:--',
              logo: store.BasicInfo?.StoreLogo || null,
              address: [
                  store.Address?.AddressLine1,
                  store.Address?.City,
                  store.Address?.State
              ].filter(Boolean).join(', ') || 'N/A'
            };
          });
          this.cdr.detectChanges(); // Explicitly trigger UI update
        } else {
          console.warn('Response did not contain a stores array', res);
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching stores', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  goToAddStore() {
    this.router.navigate(['merchant/add-store']);
  }

}
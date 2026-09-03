import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { MerchantService } from '../../../../services/merchant.service';

interface Product {
  id: string;
  image: string;
  name: string;
  subtext: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: string;
}

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit {


  stats = [
    { label: 'Total Products', value: 248, icon: 'inventory_2', color: 'blue' },
    { label: 'Active Listings', value: 231, icon: 'check_circle', color: 'green' },
    { label: 'Low Stock (< 15)', value: 7, icon: 'warning', color: 'orange' },
    { label: 'Out of Stock', value: 10, icon: 'cancel', color: 'red' }
  ];


  displayedColumns: string[] = ['product', 'sku', 'category', 'price', 'stock', 'status', 'actions'];


  dataSource: Product[] = [];
  isLoading = true;

  constructor(private router: Router, private merchantService: MerchantService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    let merchantId = '';
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const parsed = JSON.parse(token);
        merchantId = parsed?.merchantBrand?.MerchantId || parsed.merchantId || parsed.MerchantId || parsed.id || '';
      }
    } catch (e) {
      console.warn('Could not parse token from localStorage');
    }

    this.isLoading = true;
    this.merchantService.getProductList({ MerchantId: merchantId }).subscribe({
      next: (res: any) => {
        if (res && res.items) {
          this.dataSource = [...res.items.map((item: any) => ({
            id: item.ProductId,
            image: item.Images && item.Images.length > 0 ? item.Images[0] : '📦',
            name: item.ProductName,
            subtext: item.ShortProductName || item.ShortDescription || '',
            sku: item.SKU,
            category: item.CategoryName,
            price: item.SellingPrice,
            stock: item.CurrentStock,
            status: item.Status
          }))];
          this.updateStats();
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching product list', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  updateStats(): void {
    const totalProducts = this.dataSource.length;
    const activeListings = this.dataSource.filter(p => p.status.toUpperCase() === 'ACTIVE').length;
    const lowStock = this.dataSource.filter(p => p.stock > 0 && p.stock < 15).length;
    const outOfStock = this.dataSource.filter(p => p.stock === 0).length;

    this.stats = [
      { label: 'Total Products', value: totalProducts, icon: 'inventory_2', color: 'blue' },
      { label: 'Active Listings', value: activeListings, icon: 'check_circle', color: 'green' },
      { label: 'Low Stock (< 15)', value: lowStock, icon: 'warning', color: 'orange' },
      { label: 'Out of Stock', value: outOfStock, icon: 'cancel', color: 'red' }
    ];
  }


  onEdit(product: Product) { console.log('Edit product', product); }
  onView(product: Product) { console.log('View product', product); }
  onDelete(product: Product) { console.log('Delete product', product); }

  goToAddProduct(): void {
    this.router.navigate(['/merchant/products/add-product']);
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

interface Product {
  id: number;
  image: string;
  name: string;
  subtext: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-product-list',
   imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule],
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

  
  dataSource: Product[] = [
    { id: 1, image: '🍔', name: 'McSpicy Burger', subtext: 'All Stores', sku: 'KFC-001', category: 'Food', price: 149, stock: 85, status: 'Active' },
    { id: 2, image: '💊', name: 'Paracetamol 500mg × 10', subtext: 'All Stores', sku: 'MED-042', category: 'Pharmacy', price: 30, stock: 12, status: 'Active' },
    { id: 3, image: '📱', name: 'Samsung Galaxy S24 5G', subtext: 'All Stores', sku: 'SAM-S24', category: 'Electronics', price: 74999, stock: 8, status: 'Active' },
    { id: 4, image: '🌾', name: 'Basmati Rice 5kg', subtext: 'All Stores', sku: 'GRO-188', category: 'Grocery', price: 250, stock: 45, status: 'Active' },
    { id: 5, image: '🍲', name: 'Chicken Biryani', subtext: 'All Stores', sku: 'KFC-089', category: 'Food', price: 299, stock: 99, status: 'Active' },
    { id: 6, image: '🧴', name: 'Vicks VapoRub 50g', subtext: 'All Stores', sku: 'MED-012', category: 'Pharmacy', price: 89, stock: 0, status: 'Inactive' },
    { id: 7, image: '🍿', name: 'Lays Classic Salted 26g', subtext: 'All Stores', sku: 'GRO-045', category: 'Grocery', price: 20, stock: 200, status: 'Active' },
    { id: 8, image: '🎧', name: 'realme Buds T100', subtext: 'All Stores', sku: 'REL-BT1', category: 'Electronics', price: 1299, stock: 3, status: 'Active' }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {}

  
  onEdit(product: Product) { console.log('Edit product', product); }
  onView(product: Product) { console.log('View product', product); }
  onDelete(product: Product) { console.log('Delete product', product); }

  goToAddProduct(): void {
  this.router.navigate(['/merchant/products/add-product']);
}
}
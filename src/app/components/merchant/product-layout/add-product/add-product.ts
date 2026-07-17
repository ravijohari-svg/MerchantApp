import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-product',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-product.html',
  styleUrl: './add-product.scss',
})
export class AddProduct implements OnInit {
  productForm!: FormGroup;

  panels = {
    basicInfo: true,
    images: false,
    pricing: false,
    inventory: false,
    delivery: false,
    visibility: false,
    storeLocation: true,
  };

  stores = ['Store A - Main', 'Store B - Warehouse', 'Store C - Express'];
  categories = ['Food', 'Pharmacy', 'Electronics', 'Grocery'];
  subCategories = ['Burgers & Fast Food', 'OTC Medicine', 'Smartphones', 'Packaged Grains'];
  units = ['Pcs', 'Kg', 'Ltr', 'Box'];

  mainImagePreview: string | null = null;
  galleryPreviews: string[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.productForm = this.fb.group({
      productName: ['', [Validators.required, Validators.minLength(3)]],
      store: ['', Validators.required],
      category: ['', Validators.required],
      subCategory: ['', Validators.required],
      brand: [{ value: 'Auto Filled Brand', disabled: true }],
      sku: [{ value: 'S1-PROD-94821', disabled: true }],
      shortDescription: ['', [Validators.maxLength(150)]],
      longDescription: ['', [Validators.maxLength(1000)]],

      
      galleryImages: this.fb.array([]),

      price: [0, [Validators.required, Validators.min(0.01)]],

      currentStock: [150, [Validators.required, Validators.min(0)]],
      unit: ['Pcs', Validators.required],
      minStockAlert: [20, [Validators.required, Validators.min(0)]],
      maxStockAlert: [500, [Validators.required, Validators.min(1)]],
      barcode: [''],
      expiryDate: [''],

      weight: [0.0, [Validators.min(0)]],
      weightUnit: ['Kg'],
      dimensions: this.fb.group({
        length: [''],
        width: [''],
        height: [''],
      }),
      droneEligible: [false],
      fragileProduct: [false],
      temperatureControlled: [false],
      availableForPickup: [false],

      featuredProduct: [false],
      availableToday: [true],
      warehousePickup: [true],
    });
  }

  get stockStatus(): 'In Stock' | 'Low Stock' | 'Out of Stock' {
    const stock = this.productForm.get('currentStock')?.value || 0;
    const minAlert = this.productForm.get('minStockAlert')?.value || 0;

    if (stock === 0) return 'Out of Stock';
    if (stock <= minAlert) return 'Low Stock';
    return 'In Stock';
  }

  togglePanel(panelName: keyof typeof this.panels): void {
    this.panels[panelName] = !this.panels[panelName];
  }

  isInvalid(controlName: string): boolean {
    const control = this.productForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      console.log('Product Raw Value:', this.productForm.getRawValue());
    } else {
      this.productForm.markAllAsTouched();
      this.panels.basicInfo = true;
    }
  }

  get galleryImages(): FormArray {
    return this.productForm.get('galleryImages') as FormArray;
  }

  onMainImageSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    const file = element.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.mainImagePreview = reader.result as string;
        this.productForm.patchValue({ shortDescription: this.productForm.value.shortDescription }); 
      };
      reader.readAsDataURL(file);
    }
  }

  onGalleryImageSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    const file = element.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.galleryPreviews.push(reader.result as string);

        this.galleryImages.push(this.fb.control(file));
      };
      reader.readAsDataURL(file);
    }
  }

  removeGalleryImage(index: number): void {
    this.galleryPreviews.splice(index, 1);
    this.galleryImages.removeAt(index);
  }
}

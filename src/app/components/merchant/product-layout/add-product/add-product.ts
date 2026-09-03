import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MerchantService } from '../../../../services/merchant.service';

export interface GallerySlot {
  key: string;
  label: string;
  base64: string | null;
  fileName: string | null;
  error?: string;
  isUploading?: boolean;
}

@Component({
  selector: 'app-add-product',
  imports: [CommonModule, ReactiveFormsModule, MatIcon],
  templateUrl: './add-product.html',
  styleUrl: './add-product.scss',
})
export class AddProduct implements OnInit {
  productForm!: FormGroup;
  activeSectionIndex: number = 0; // 0 to 8

  sections = [
    { id: 1, name: 'Basic Information', icon: '📝' },
    { id: 2, name: 'Images & Media', icon: '🖼️' },
    { id: 3, name: 'Category & Attributes', icon: '🏷️' },
    { id: 4, name: 'Variants', icon: '📚' },
    { id: 5, name: 'Pricing', icon: '💰' },
    { id: 6, name: 'Inventory', icon: '📦' },
    { id: 7, name: 'Packaging & Delivery', icon: '🚚' },
    { id: 8, name: 'Visibility', icon: '🌐' },
    { id: 9, name: 'Review & Publish', icon: '✅' },
  ];

  gallerySlots: GallerySlot[] = [
    { key: 'main', label: 'Main Image', base64: null, fileName: null },
    { key: 'gallery1', label: 'Gallery 1', base64: null, fileName: null },
    { key: 'gallery2', label: 'Gallery 2', base64: null, fileName: null },
    { key: 'gallery3', label: 'Gallery 3', base64: null, fileName: null },
    { key: 'thumbnail', label: 'Thumbnail', base64: null, fileName: null },
    { key: 'video', label: 'Video', base64: null, fileName: null },
  ];

  selectedImageSlot: string = 'main';
  showSuccessModal: boolean = false;
  showErrorModal: boolean = false;
  errorMessage: string = '';
  stores: any[] = [];
  categories: any[] = [];
  subCategories: any[] = [];

  constructor(
    private fb: FormBuilder,
    private merchantService: MerchantService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.fetchStores();
    this.fetchCategories();
  }

  fetchCategories(): void {
    this.merchantService.getCategories().subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.categories = res.data;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
      }
    });
  }

  onCategoryChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const categoryId = selectElement.value;

    // Reset subCategory
    this.productForm.get('basicInfo.subCategory')?.setValue('');
    this.subCategories = [];

    if (categoryId) {
      this.merchantService.getCategories(categoryId).subscribe({
        next: (res: any) => {
          if (res.success && res.data) {
            this.subCategories = res.data;
            this.cdr.detectChanges();
          }
        },
        error: (err) => {
          console.error('Error fetching subcategories:', err);
        }
      });
    }
  }

  fetchStores(): void {
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
        let res = response;
        if (typeof response === 'string') {
          res = JSON.parse(response);
        } else if (response && response.body && typeof response.body === 'string') {
          res = JSON.parse(response.body);
        } else if (response && response.body && typeof response.body === 'object') {
          res = response.body;
        }

        if (res && res.stores) {
          this.stores = res.stores.map((store: any) => ({
            id: store.StoreId || store.storeId || store.id || 'Unknown',
            name: store.StoreName || 'Unnamed Store'
          }));
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Error fetching stores', err);
      }
    });
  }

  initForm(): void {
    this.productForm = this.fb.group({
      // Section 1: Basic Information
      basicInfo: this.fb.group({
        productName: ['', [Validators.required, Validators.maxLength(120)]],
        storeId: ['', Validators.required],
        shortProductName: [''],
        brand: [''],
        category: ['', Validators.required],
        subCategory: ['', Validators.required],
        productType: [''],
        status: ['Active'],
        // sku: ['F00-4641'],
        // barcode: [''],
        shortDescription: ['', Validators.maxLength(160)],
        detailedDescription: ['', Validators.maxLength(2000)],
      }),

      // Section 2: Images & Media
      imagesMedia: this.fb.group({
        main: [null],
        gallery1: [null],
        gallery2: [null],
        gallery3: [null],
        thumbnail: [null],
        video: [null],
      }),

      // Section 3: Category & Attributes
      categoryAttributes: this.fb.group({
        weight: [''],
        ingredients: [''],
        vegNonVeg: [''],
        shelfLife: [''],
        storageInstructions: [''],
        countryOfOrigin: [''],
      }),

      // Section 4: Variants
      variants: this.fb.array([]),

      // Section 5: Pricing
      pricing: this.fb.group({
        sellingPrice: ['', [Validators.required, Validators.min(0)]],
        mrp: ['', [Validators.required, Validators.min(0)]],
        costPrice: [''],
        gstRate: [''],
        discountType: [''],
        discountValue: [0],
        minOrderQty: [1],
        maxOrderQty: [10],
      }),

      // Section 6: Inventory
      inventory: this.fb.group({
        currentStock: [0, [Validators.required, Validators.min(0)]],
        reservedStock: [0],
        incomingStock: [0],
        warehouse: [''],
        batchNumber: ['BTH-2024-001'],
        lowStockThreshold: [10],
        reorderQty: [50],
        expiryDate: [''],
        barcode: ['8901396110498'],
        inventoryTracking: [true],
        continueSellingOutOfStock: [false],
      }),

      // Section 7: Packaging & Delivery
      packagingDelivery: this.fb.group({
        weightKg: [0.5],
        lengthCm: [20],
        widthCm: [15],
        heightCm: [10],
        packageType: ['Standard Box'],
        fragileItem: [false],
        temperatureControlled: [false],
        hazardousMaterial: [false],
        droneCompatible: [true],
        estimatedPickupTime: [''],
      }),

      // Section 8: Visibility
      visibilitySeo: this.fb.group({
        publishNow: [true], // Default enabled (blue toggle in UI)
        schedulePublish: [false],
        featuredProduct: [false],
        showOnHomepage: [false],
        availableOnline: [true], // Default enabled (blue toggle in UI)
        searchTags: ['burger, fast food, fried chicken...'],
        seoTitle: ['McSpicy Burger – Order Online | S1 Fast Delivery'],
        seoDescription: [
          'Order McSpicy Burger online. Hot, fresh and delivered in minutes via S1 drone delivery.',
        ],
        urlSlug: ['mcspicy-burger'],
      }),
    });

    // Seed initial variant
    this.addVariant();
  }

  // Getters for Form Arrays and Form Groups
  get variantsArray(): FormArray {
    return this.productForm.get('variants') as FormArray;
  }

  createVariantGroup(): FormGroup {
    const index = this.variantsArray ? this.variantsArray.length + 1 : 1;
    return this.fb.group({
      name: [`Variant ${index}`],
      sku: [`F00-${Math.floor(1000 + Math.random() * 9000)}`],
      sellingPrice: [''],
      mrp: [''],
      stock: [0],
      status: ['Active'],
    });
  }

  generateVariants(): void {
    // Logic to auto-generate variants if needed
    if (this.variantsArray.length === 0) {
      this.addVariant();
    }
  }

  addVariant(): void {
    this.variantsArray.push(this.createVariantGroup());
  }

  removeVariant(index: number): void {
    this.variantsArray.removeAt(index);
  }

  // Section Validation Status Checks
  isSectionValid(sectionIndex: number): boolean {
    const keys = [
      'basicInfo',
      'imagesMedia',
      'categoryAttributes',
      'variants',
      'pricing',
      'inventory',
      'packagingDelivery',
      'visibilitySeo',
    ];

    if (sectionIndex === 8) {
      // Review section is valid if all previous mandatories are valid
      return keys.every((_, idx) => this.isSectionValid(idx));
    }

    const control = this.productForm.get(keys[sectionIndex]);
    return control ? control.valid : true;
  }

  get completedSectionsCount(): number {
    let count = 0;
    for (let i = 0; i < 8; i++) {
      if (this.isSectionValid(i)) count++;
    }
    return count;
  }

  get totalCompletionPercentage(): number {
    return Math.round((this.completedSectionsCount / 8) * 100);
  }

  selectPackageType(type: string): void {
    this.productForm.get('packagingDelivery.packageType')?.setValue(type);
  }

  // Accordion & Navigation Controls
  toggleSection(index: number): void {
    this.activeSectionIndex = this.activeSectionIndex === index ? -1 : index;
  }

  nextSection(): void {
    if (this.activeSectionIndex < this.sections.length - 1) {
      this.activeSectionIndex++;
    }
  }

  previousSection(): void {
    if (this.activeSectionIndex > 0) {
      this.activeSectionIndex--;
    }
  }

  navigateToSection(index: number): void {
    this.activeSectionIndex = index;
  }

  // Image handling and 5MB Validation logic
  selectImageSlot(slotKey: string): void {
    this.selectedImageSlot = slotKey;
  }

  onFileSelected(event: Event, slotKey?: string): void {
    const targetKey = slotKey || this.selectedImageSlot;
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];
      const maxSizeBytes = 5 * 1024 * 1024; // 5 MB

      const slot = this.gallerySlots.find((s) => s.key === targetKey);

      if (file.size > maxSizeBytes) {
        if (slot) slot.error = 'File size exceeds 5MB limit!';
        alert(`File size exceeds 5MB limit for ${slot?.label || targetKey}!`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64Str = reader.result as string;
        const base64Payload = base64Str.split(',')[1];

        if (slot) {
          slot.base64 = base64Str; // Show immediate preview
          slot.fileName = file.name;
          slot.error = undefined;
          slot.isUploading = true;
          this.cdr.detectChanges(); // Trigger Angular to update the UI immediately
        }

        const payload = {
          base64: base64Payload,
          fileName: file.name,
          contentType: file.type,
          folder: 'products'
        };

        this.merchantService.uploadFile(payload).subscribe({
          next: (res: any) => {
            try {
              let parsedRes = res;
              if (typeof res === 'string') {
                parsedRes = JSON.parse(res);
              }

              let uploadedUrl = parsedRes?.data?.url || parsedRes?.url;
              if (!uploadedUrl && typeof parsedRes?.data === 'string') {
                uploadedUrl = parsedRes.data;
              }

              if (uploadedUrl) {
                this.productForm.get('imagesMedia')?.get(targetKey)?.setValue(uploadedUrl);
                if (slot) {
                  slot.base64 = uploadedUrl; // Update preview to s3 url
                  slot.isUploading = false;
                }
              } else {
                alert('Upload failed: Invalid response');
                if (slot) slot.isUploading = false;
              }
            } catch (e) {
              console.error('Parsing error', e);
              if (slot) slot.isUploading = false;
            }
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Upload error', err);
            alert('Upload failed. Please try again.');
            if (slot) slot.isUploading = false;
            this.cdr.detectChanges();
          }
        });
      };
      reader.readAsDataURL(file);
    }
  }

  // Active preview image helper
  get activePreviewImage(): string | null {
    const slot = this.gallerySlots.find((s) => s.key === this.selectedImageSlot);
    return slot?.base64 || this.gallerySlots[0].base64;
  }

  // Draft Save & Form Submission Handler
  onSaveDraft(): void {
    const payload = this.productForm.value;
    console.log('--- SAVE AS DRAFT PAYLOAD ---', payload);
    alert('Draft saved! Payload generated in console log.');
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      alert('Please complete all mandatory fields before publishing.');
      return;
    }
    const payload = this.productForm.value;
    console.log('--- PUBLISH PRODUCT PAYLOAD ---', payload);
    alert('Product successfully published!');
  }

  // Add helper getters/methods inside AddProductComponent:

  // Dynamic check for remaining sections count
  get remainingSectionsCount(): number {
    let incompleteCount = 0;
    for (let i = 0; i < 8; i++) {
      if (!this.isSectionValid(i)) {
        incompleteCount++;
      }
    }
    return incompleteCount;
  }

  // Action handlers for Section 9
  onPreview(): void {
    console.log('Previewing product form...', this.productForm.value);
  }

  onPublish(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      alert('Please fill in all required fields before publishing.');
      return;
    }

    const val = this.productForm.value;

    let merchantId = 'MB00013';
    let merchantName = 'Skye Retail Pvt Ltd';
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const parsed = JSON.parse(token);
        merchantId = parsed?.merchantBrand?.MerchantId || parsed.merchantId || parsed.MerchantId || parsed.id || merchantId;
        merchantName = parsed?.merchantBrand?.BrandName || parsed.merchantName || merchantName;
      }
    } catch (e) { }

    const storeId = val.basicInfo.storeId;
    const store = this.stores.find(s => s.id === storeId);

    // Attempt to find Category name from subcategories array
    const subCat = this.subCategories.find(s => (s.SubCategoryId || s.CategoryId || s._id || s.id) === val.basicInfo.subCategory);
    const categoryName = subCat ? (subCat.SubCategoryName || subCat.CategoryName || subCat.name) : '';

    // Collect all uploaded S3 images that are not null
    const commonImages = Object.values(val.imagesMedia).filter(img => typeof img === 'string' && img.trim() !== '');

    const payload = {
      StoreId: storeId,
      StoreName: store ? store.name : '',
      MerchantId: merchantId,
      MerchantName: merchantName,
      CategoryId: val.basicInfo.subCategory,
      ParentCategoryId: val.basicInfo.category,
      CategoryName: categoryName,
      ProductName: val.basicInfo.productName,
      ShortProductName: val.basicInfo.shortProductName,
      ProductType: val.variants && val.variants.length > 0 ? "VARIABLE" : "SIMPLE",
      Brand: val.basicInfo.brand,
      ShortDescription: val.basicInfo.shortDescription,
      DetailedDescription: val.basicInfo.detailedDescription,
      AddedBy: "MERCHANT",
      CommonImages: commonImages,
      Attributes: { ...val.categoryAttributes },
      Location: {
        Latitude: 28.4595, // Fallback coordinates
        Longitude: 77.0266
      },
      MinimumOrderQty: val.pricing.minOrderQty,
      MaximumOrderQty: val.pricing.maxOrderQty,
      LowStockAlertThreshold: val.inventory.lowStockThreshold,
      ReorderQty: val.inventory.reorderQty,
      Variants: val.variants.map((v: any) => ({
        VariantName: v.name,
        SKU: v.sku,
        SellingPrice: v.sellingPrice,
        MRP: v.mrp,
        CurrentStock: v.stock,
        Status: v.status,
        Images: commonImages.length > 0 ? [commonImages[0]] : []
      }))
    };

    console.log('Publishing product payload...', payload);

    this.merchantService.addProduct(payload).subscribe({
      next: (res: any) => {
        console.log('Add Product Response:', res);
        if (res && res.success === false) {
          this.errorMessage = res.message || 'Failed to publish product.';
          this.showErrorModal = true;
        } else {
          this.showSuccessModal = true;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Add Product Error:', err);
        const errMsg = err.error?.message || err.message || 'Failed to publish product. Please try again.';
        this.errorMessage = errMsg;
        this.showErrorModal = true;
        this.cdr.detectChanges();
      }
    });
  }

  // Modal Action Handlers
  onViewProduct(): void {
    console.log('Navigating to View Product page...');
    this.router.navigate(['merchant/products/list']);
  }

  onAddAnotherProduct(): void {
    this.showSuccessModal = false;
    this.productForm.reset();
    this.activeSectionIndex = 0; // Reset back to section 1
  }

  onBackToProducts(): void {
    this.showSuccessModal = false;
    this.router.navigate(['merchant/products/list']);
  }

  closeErrorModal(): void {
    this.showErrorModal = false;
    this.errorMessage = '';
  }

  setStatus(status: 'Draft' | 'Active'): void {
    this.productForm.get('basicInfo.status')?.setValue(status);
  }
}

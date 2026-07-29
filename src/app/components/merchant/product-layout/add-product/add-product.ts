import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

export interface GallerySlot {
  key: string;
  label: string;
  base64: string | null;
  fileName: string | null;
  error?: string;
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

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.productForm = this.fb.group({
      // Section 1: Basic Information
      basicInfo: this.fb.group({
        productName: ['', [Validators.required, Validators.maxLength(120)]],
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
        weightVolume: [''],
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
        if (slot) {
          slot.base64 = base64Str;
          slot.fileName = file.name;
          slot.error = undefined;
        }
        this.productForm.get('imagesMedia')?.get(targetKey)?.setValue(base64Str);
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
    this.showSuccessModal = true;
    if (this.productForm.valid) {
      console.log('Publishing product...', this.productForm.value);
    } else {
      alert('Please fill in all required fields before publishing.');
    }
  }

  // Modal Action Handlers
  onViewProduct(): void {
    console.log('Navigating to View Product page...');
    // Add router navigation logic, e.g.: this.router.navigate(['/products', productId]);
  }

  onAddAnotherProduct(): void {
    this.showSuccessModal = false;
    this.productForm.reset();
    this.activeSectionIndex = 0; // Reset back to section 1
  }

  onBackToProducts(): void {
    this.showSuccessModal = false;
    // Add router navigation logic, e.g.: this.router.navigate(['/products']);
  }

  setStatus(status: 'Draft' | 'Active'): void {
    this.productForm.get('basicInfo.status')?.setValue(status);
  }
}

import { Component, OnInit ,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import * as L from 'leaflet';

@Component({
  selector: 'app-add-store',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-store.html',
  styleUrl: './add-store.scss',
})
export class AddStore implements OnInit {
  storeForm!: FormGroup;

  activeSection: string | null = 'basic';
  map!: L.Map;
  marker!: L.Marker;
  defaultLat = 40.7128;
  defaultLng = -74.006;

  weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  logoPreviewUrl: string = '';
  bannerPreviewUrl: string = '';
  showReviewModal: boolean = false;

  bannerFiles: File[] = [];
  bannerPreviews: string[] = [];
  showSuccessModal: boolean = false;


  constructor(private fb: FormBuilder , private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    const daysConfig = this.weekDays.reduce((acc, day) => {
      const isWeekend = day === 'Sat' || day === 'Sun';
      acc[day.toLowerCase()] = [!isWeekend];
      return acc;
    }, {} as { [key: string]: any });

    this.storeForm = this.fb.group({
      basicInfo: this.fb.group({
        storeName: ['', [Validators.required]],
        storeType: ['', [Validators.required]],
        description: [''],
        storeLogo: [null],
        storeBanners: [[]],
      }),
      contactInfo: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required]],
        website: [''],
      }),
      location: this.fb.group({
        address: ['', [Validators.required]],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        zipCode: ['', [Validators.required]],
        latitude: [this.defaultLat],

        longitude: [this.defaultLng],
      }),
      // inside initForm() -> storeForm initialization setup:
      operatingHours: this.fb.group({
        days: this.fb.group(daysConfig),
        // Switch standard controls to an Angular FormArray
        timeSlots: this.fb.array([this.createTimeSlot('09:00 AM', '09:00 PM')]),
        holidayMode: [false],
        specialHours: ['']
      }),
     configuration: this.fb.group({
        acceptOrders: [true],
        acceptScheduledOrders: [true],
        enableDroneDelivery: [false],
        allowCustomerPickup: [true],
        storeStatus: ['open', [Validators.required]],
        dronePickupName: [''],
        pickupInstructions: ['']
      })
    });
  }

  createTimeSlot(open: string = '', close: string = ''): FormGroup {
    return this.fb.group({
      openTime: [open, [Validators.required]],
      closeTime: [close, [Validators.required]]
    });
  }

  get timeSlots(): FormArray {
    return this.storeForm.get('operatingHours.timeSlots') as FormArray;
  }

  isSectionValid(groupName: string): boolean {
    const group = this.storeForm.get(groupName);
    return group ? group.valid : false;
  }

 onFileChange(event: Event, controlName: string): void {
    const element = event.target as HTMLInputElement;
    const file = element.files?.[0] || null;
    this.storeForm.get(`basicInfo.${controlName}`)?.setValue(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (controlName === 'storeLogo') {
          this.logoPreviewUrl = reader.result as string;
        } else if (controlName === 'storeBanners') {
          this.bannerPreviewUrl = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }


  onSubmit(): void {
    if (this.storeForm.valid) {
      console.log('Form Data Registered:', this.storeForm.value);
      // alert('Store saved successfully!');
      this.onSubmitForm();
    } else {
      this.storeForm.markAllAsTouched();
      alert('Please fill out all required fields.');
    }
  }

 // Submit main form triggers the Popup overlay
  onSubmitForm(): void {
    const sectionsToValidate = ['basicInfo', 'contactInfo', 'location', 'operatingHours'];
    let isValid = true;

    sectionsToValidate.forEach(key => {
      const control = this.storeForm.get(key);
      if (control && !control.valid) {
        isValid = false;
      }
    });

    if (isValid) {
      this.showReviewModal = true;
    } else {
      this.storeForm.markAllAsTouched();
      alert('Please fill out all required fields marked with * before reviewing.');
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initMap();
    }, 300);
  }

  createForm() {
    this.storeForm = this.fb.group({
      location: this.fb.group({
        address: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zipCode: ['', Validators.required],
        latitude: [this.defaultLat],
        longitude: [this.defaultLng],
      }),
    });
  }

  get locationForm(): FormGroup {
    return this.storeForm.get('location') as FormGroup;
  }

  toggleSection(section: string) {
    if (this.activeSection === section) {
      this.activeSection = '';
    } else {
      this.activeSection = section;
    }
  }

  initMap() {
    this.map = L.map('storeMap').setView([this.defaultLat, this.defaultLng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    const icon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });

    this.marker = L.marker([this.defaultLat, this.defaultLng], {
      draggable: true,
      icon: icon,
    }).addTo(this.map);

    this.map.on('click', (event: L.LeafletMouseEvent) => {
      const lat = event.latlng.lat;

      const lng = event.latlng.lng;

      this.moveMarker(lat, lng);
    });

    this.marker.on('dragend', () => {
      const position = this.marker.getLatLng();
      this.updateLocation(position.lat, position.lng);
    });

    this.updateLocation(this.defaultLat, this.defaultLng);
  }

  moveMarker(lat: number, lng: number) {
    this.marker.setLatLng([lat, lng]);

    this.updateLocation(lat, lng);
  }

  updateLocation(lat: number, lng: number) {
    this.locationForm.patchValue({
      latitude: lat.toFixed(6),

      longitude: lng.toFixed(6),
    });
    this.reverseGeocode(lat, lng);
  }

  reverseGeocode(lat: number, lng: number) {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
      .then((response) => response.json())

      .then((data) => {
        const address = data.address;

        this.locationForm.patchValue({
          address: data.display_name || '',

          city: address.city || address.town || address.village || '',

          state: address.state || '',

          zipCode: address.postcode || '',
        });
      })

      .catch((error) => console.error('Geocoding error', error));
  }

  submit() {
    console.log(this.storeForm.value);
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

  addTimeSlot(): void {
  // Logic to dynamically push additional time setups if required
  this.timeSlots.push(this.createTimeSlot());
  console.log('Add additional time slots clicked');
}

removeTimeSlot(index: number): void {
    if (this.timeSlots.length > 1) {
      this.timeSlots.removeAt(index);
    }
  }


  getFormattedWorkingDays(): string {
    const daysGroup = this.storeForm.get('operatingHours.days')?.value;
    if (!daysGroup) return 'None';
    
    const selectedDays = this.weekDays.filter(day => daysGroup[day.toLowerCase()]);
    if (selectedDays.length === 0) return 'None';
    if (selectedDays.length === 7) return 'Everyday';
    
    return selectedDays.join(', ');
  }

  // Edit action closes popup and targets the specific accordion
  editSection(sectionKey: string): void {
    this.showReviewModal = false;
    this.activeSection = sectionKey;
  }



  onFinalSubmit(): void {
    if (this.storeForm.valid) {
      console.log('Final Payload Created:', this.storeForm.value);
      // alert('Store saved and created successfully!');
      this.showReviewModal = false;
    this.showSuccessModal = true;
    this.cdr.detectChanges();
    } else {
      alert('Please accept the declaration agreement checklist to proceed.');
    }
  }
  
  
  // 3. Add these navigation helper methods for the success modal buttons
goToStore(): void {
  this.showSuccessModal = false;
  // Add your routing logic here, e.g., this.router.navigate(['/store-dashboard']);
  console.log('Navigating to individual store dashboard...');
}

backToStoreList(): void {
  this.showSuccessModal = false;
  // Add your routing logic here, e.g., this.router.navigate(['/stores']);
  console.log('Navigating back to full store list...');
}



 // Logo Upload (Single)
 // Logo Upload (Single)
  onLogoChange(event: Event): void {
    const element = event.target as HTMLInputElement;
    const file = element.files?.[0] || null;

    if (file) {
      this.storeForm.get('basicInfo.storeLogo')?.setValue(file);

      const reader = new FileReader();
      reader.onload = () => {
        // Set the preview URL string
        this.logoPreviewUrl = reader.result as string;
        
        // Force an immediate DOM check to ensure the image appears instantly
        this.cdr.detectChanges(); 
      };
      reader.readAsDataURL(file);

      // Clear the input value so uploading the same file again still fires (change)
      element.value = '';
    }
  }


  // Banner Upload (Multiple - One by One)
 onBannerUpload(event: Event): void {
    const element = event.target as HTMLInputElement;
    const file = element.files?.[0] || null;

    if (file) {
      this.bannerFiles = [...this.bannerFiles, file];
      this.storeForm.get('basicInfo.storeBanners')?.setValue(this.bannerFiles);

      const reader = new FileReader();
      reader.onload = () => {
        // Update array reference
        this.bannerPreviews = [...this.bannerPreviews, reader.result as string];
        
        // Force Angular to render the newly added DOM element immediately
        this.cdr.detectChanges(); 
      };
      reader.readAsDataURL(file);

      element.value = '';
    }
  }
  // Remove a single uploaded banner
 removeBanner(index: number): void {
    this.bannerFiles = this.bannerFiles.filter((_, i) => i !== index);
    this.bannerPreviews = this.bannerPreviews.filter((_, i) => i !== index);
    this.storeForm.get('basicInfo.storeBanners')?.setValue(this.bannerFiles);
    
    // Force UI to remove the banner from DOM immediately
    this.cdr.detectChanges(); 
  }
}

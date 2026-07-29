import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors } from '@angular/forms';
import * as L from 'leaflet';

@Component({
  selector: 'app-add-store',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-store.html',
  styleUrl: './add-store.scss',
})
export class AddStore implements OnInit, AfterViewInit, OnDestroy {
  storeForm!: FormGroup;

  activeSection: string | null = 'basic';
  map!: L.Map;
  marker!: L.Marker;
  defaultLat = 28.4595;
  defaultLng = 77.0266;

  weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  logoPreviewUrl: string = '';
  bannerPreviewUrl: string = '';
  showReviewModal: boolean = false;

  bannerFiles: File[] = [];
  bannerPreviews: string[] = [];
  showSuccessModal: boolean = false;
  locationSuggestions: Array<{ display_name: string; lat: string; lon: string; address?: string }> = [];
  showLocationSuggestions = false;
  searchLocationTimeout: ReturnType<typeof setTimeout> | null = null;
  searchLocationAbortController: AbortController | null = null;
  searchLocationDebounceMs = 400;

  constructor(private fb: FormBuilder , private cdr: ChangeDetectorRef) {}

  requireAtLeastOneImage = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    return Array.isArray(value) && value.length > 0 ? null : { required: true };
  };

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
        description: ['', [Validators.required]],
        storeLogo: [null, [Validators.required]],
        storeBanners: [[], [this.requireAtLeastOneImage]],
      }),
      contactInfo: this.fb.group({
        managerName: ['', [Validators.required]],
        contactPhone: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        supportPhone: ['', [Validators.required]],
        emergencyContact: [''],
        website: [''],
      }),
      location: this.fb.group({
        searchQuery: [''],
        address: ['', [Validators.required]],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        zipCode: ['', [Validators.required]],
        latitude: [this.defaultLat, [Validators.required]],
        longitude: [this.defaultLng, [Validators.required]],
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
        dronePickupName: ['', [Validators.required]],
        pickupInstructions: [''],
        confirmDeclaration: [false],
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

  getControl(path: string) {
    return this.storeForm.get(path);
  }

  showControlError(path: string): boolean {
    const control = this.getControl(path);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  errorMessage(path: string): string {
    const control = this.getControl(path);
    if (!control) {
      return '';
    }

    if (control.hasError('required')) {
      if (path.endsWith('storeName')) {
        return 'Store name is required.';
      }
      if (path.endsWith('storeType')) {
        return 'Store type is required.';
      }
      if (path.endsWith('managerName')) {
        return 'Store manager is required.';
      }
      if (path.endsWith('contactPhone')) {
        return 'Contact number is required.';
      }
      if (path.endsWith('email')) {
        return 'Email address is required.';
      }
      if (path.endsWith('supportPhone')) {
        return 'Support number is required.';
      }
      if (path.endsWith('description')) {
        return 'Description is required.';
      }
      if (path.endsWith('storeLogo')) {
        return 'Store logo is required.';
      }
      if (path.endsWith('storeBanners')) {
        return 'Upload at least one banner image.';
      }
      if (path.endsWith('address')) {
        return 'Street address is required.';
      }
      if (path.endsWith('city')) {
        return 'City is required.';
      }
      if (path.endsWith('state')) {
        return 'State is required.';
      }
      if (path.endsWith('zipCode')) {
        return 'Zip code is required.';
      }
      if (path.endsWith('latitude')) {
        return 'Latitude is required.';
      }
      if (path.endsWith('longitude')) {
        return 'Longitude is required.';
      }
      if (path.endsWith('openTime')) {
        return 'Opening time is required.';
      }
      if (path.endsWith('closeTime')) {
        return 'Closing time is required.';
      }
      if (path.endsWith('storeStatus')) {
        return 'Please select store status.';
      }
      if (path.endsWith('dronePickupName')) {
        return 'Drone pickup point is required.';
      }
      if (path.endsWith('pickupInstructions')) {
        return 'Pickup instructions are required.';
      }
      return 'This field is required.';
    }

    if (control.hasError('email')) {
      return 'Enter a valid email address.';
    }

    return 'Invalid value.';
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

  ngAfterViewInit(): void {
    if (this.activeSection === 'location') {
      this.ensureMapReady();
    }
  }

  createForm() {
    this.storeForm = this.fb.group({
      location: this.fb.group({
        searchQuery: [''],
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

    if (section === 'location' && this.activeSection === 'location') {
      this.ensureMapReady();
    }
  }

  private ensureMapReady(): void {
    setTimeout(() => {
      if (!this.map) {
        this.initMap();
      }

      this.map.invalidateSize();
    });
  }

  initMap() {
    const mapElement = document.getElementById('storeMap');

    if (!mapElement) {
      return;
    }

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

  searchLocation(): void {
    const query = this.locationForm.get('searchQuery')?.value?.trim();

    if (!query) {
      this.locationSuggestions = [];
      this.showLocationSuggestions = false;
      return;
    }

    this.ensureMapReady();

    fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(query)}`)
      .then((response) => response.json())
      .then((results) => {
        if (!results.length) {
          alert('No location found. Please try a more specific address.');
          return;
        }

        const result = results[0];
        const lat = Number(result.lat);
        const lng = Number(result.lon);

        this.map.setView([lat, lng], 16);
        this.moveMarker(lat, lng);
        this.locationSuggestions = [];
        this.showLocationSuggestions = false;
      })
      .catch((error) => {
        console.error('Location search error', error);
        alert('Unable to search location right now. Please try again.');
      });
  }

  searchLocationSuggestions(): void {
    const query = this.locationForm.get('searchQuery')?.value?.trim();

    if (this.searchLocationTimeout) {
      clearTimeout(this.searchLocationTimeout);
      this.searchLocationTimeout = null;
    }

    if (!query || query.length < 3) {
      if (this.searchLocationAbortController) {
        this.searchLocationAbortController.abort();
        this.searchLocationAbortController = null;
      }

      this.locationSuggestions = [];
      this.showLocationSuggestions = false;
      return;
    }

    this.searchLocationTimeout = setTimeout(() => {
      this.executeLocationSuggestionSearch(query);
    }, this.searchLocationDebounceMs);
  }

  private executeLocationSuggestionSearch(query: string): void {
    if (this.searchLocationAbortController) {
      this.searchLocationAbortController.abort();
    }

    this.searchLocationAbortController = new AbortController();

    fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&q=${encodeURIComponent(query)}`, {
      signal: this.searchLocationAbortController.signal,
    })
      .then((response) => response.json())
      .then((results) => {
        this.locationSuggestions = results || [];
        this.showLocationSuggestions = this.locationSuggestions.length > 0;
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          return;
        }

        console.error('Location suggestion error', error);
        this.locationSuggestions = [];
        this.showLocationSuggestions = false;
      })
      .finally(() => {
        this.searchLocationAbortController = null;
      });
  }

  selectLocationSuggestion(suggestion: { display_name: string; lat: string; lon: string; address?: string }): void {
    const lat = Number(suggestion.lat);
    const lng = Number(suggestion.lon);

    this.locationForm.patchValue({
      searchQuery: suggestion.display_name,
    });

    this.map.setView([lat, lng], 16);
    this.moveMarker(lat, lng);
    this.locationSuggestions = [];
    this.showLocationSuggestions = false;
  }

  useCurrentLocation(): void {
    if (!navigator.geolocation) {
      alert('Current location is not supported by this browser.');
      return;
    }

    this.ensureMapReady();

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        this.map.setView([lat, lng], 16);
        this.moveMarker(lat, lng);
      },
      (error) => {
        console.error('Current location error', error);
        alert('Unable to access current location. Please allow location permission and try again.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
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
          searchQuery: data.display_name || this.locationForm.get('searchQuery')?.value || '',
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

    if (this.searchLocationTimeout) {
      clearTimeout(this.searchLocationTimeout);
      this.searchLocationTimeout = null;
    }

    if (this.searchLocationAbortController) {
      this.searchLocationAbortController.abort();
      this.searchLocationAbortController = null;
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
    const declarationAccepted = this.storeForm.get('configuration.confirmDeclaration')?.value;

    if (this.storeForm.valid && declarationAccepted) {
      console.log('Final Payload Created:', this.storeForm.value);
      this.showReviewModal = false;
      this.showSuccessModal = true;
      this.cdr.detectChanges();
    } else if (!declarationAccepted) {
      alert('Please accept the declaration agreement before submitting.');
    } else {
      alert('Please fix the form errors before submitting.');
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

import { Component, inject, ChangeDetectorRef, NgZone, ViewChild } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormArray, FormGroup } from '@angular/forms';

import { FormsModule } from '@angular/forms';

import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, Router } from '@angular/router';
import { MerchantService } from '../../../services/merchant.service';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.html',
  styleUrl: './register.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatStepperModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    RouterLink,
  ],
})
export class Register {
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  cdr = inject(ChangeDetectorRef);
  zone = inject(NgZone);
  merchantService = inject(MerchantService);
  router = inject(Router);

  @ViewChild('stepper') stepper!: MatStepper;

  isLinear = false;
  isUploadingLogo = false;
  errorMessage = '';
  isSubmitting = false;

  // STEP 1
  businessForm = this.fb.group({
    businessName: ['', Validators.required],

    businessType: ['', Validators.required],

    gstNumber: ['', Validators.required],

    panNumber: ['', Validators.required],

    ownerName: ['', Validators.required],

    mobileNumber: ['', Validators.required],

    email: ['', [Validators.required, Validators.email]],

    designation: ['', Validators.required],
  });

  // STEP 2
  brandForm = this.fb.group({
    brandName: ['', Validators.required],

    website: [''],

    description: ['', Validators.required],

    otherCategory: [''],

    logoUrl: [''],
  });

  allCategories: any[] = [];

  filteredCategories: any[] = [];

  selectedCategories: string[] = [];

  searchText = '';

  storeForm = this.fb.group({
    location: [''],
    addresses: this.fb.array([]),
  });

  days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  documentsForm = this.fb.group({
    documents: this.fb.array([]),
  });

  documentList = [
    {
      title: 'GST Certificate',
      required: true,
      removable: false,
    },
    {
      title: 'Business License',
      required: true,
      removable: false,
    },
    {
      title: 'FSSAI Certificate',
      required: false,
      removable: true,
    },
    {
      title: 'PAN Card',
      required: true,
      removable: false,
    },
  ];

  bankForm = this.fb.group({
    accountHolderName: ['', Validators.required],
    bankName: ['', Validators.required],
    accountNumber: ['', Validators.required],
    confirmAccountNumber: ['', Validators.required],
    ifscCode: ['', Validators.required],
    upiId: [''],
  });

  ngOnInit() {
    this.addAddress();
    this.initializeDocuments();
    this.fetchCategories();
  }

  fetchCategories() {
    this.merchantService.getCategories().subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.allCategories = res.data;
          this.allCategories.push({ CategoryName: 'Other' });
          this.filteredCategories = [...this.allCategories];
        }
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
      }
    });
  }

  addAddress() {
    this.addresses.push(this.createAddressForm());
  }

  removeAddress(index: number) {
    this.addresses.removeAt(index);
  }

  get addresses(): FormArray {
    return this.storeForm.get('addresses') as FormArray;
  }

  isAddressSelected(index: number, day: string) {
    return this.addresses.at(index).value.workingDays?.includes(day);
  }

  get documents(): FormArray {
    return this.documentsForm.get('documents') as FormArray;
  }

  toggleDay(index: number, day: string) {
    const control = this.addresses.at(index);

    const value = [...(control.value.workingDays || [])];

    const i = value.indexOf(day);

    if (i > -1) {
      value.splice(i, 1);
    } else {
      value.push(day);
    }

    control.patchValue({
      workingDays: value,
    });
  }

  filterCategory() {
    this.filteredCategories = this.allCategories.filter((x) =>
      x.CategoryName.toLowerCase().includes(this.searchText.toLowerCase()),
    );
  }

  toggleCategory(category: string) {
    const index = this.selectedCategories.indexOf(category);

    if (index > -1) {
      this.selectedCategories.splice(index, 1);

      if (category === 'Other') {
        this.brandForm.patchValue({
          otherCategory: '',
        });
      }
    } else {
      this.selectedCategories.push(category);
    }
  }

  isSelected(category: string) {
    return this.selectedCategories.includes(category);
  }

  removeCategory(category: string) {
    this.selectedCategories = this.selectedCategories.filter((x) => x != category);
  }

  submit() {
    const business = this.businessForm.value;
    const brand = this.brandForm.value;
    const store = this.storeForm.value;
    const bank = this.bankForm.value;
    const docs = this.documents.value;

    const getDocUrl = (title: string) => {
      const index = this.documentList.findIndex(d => d.title === title);
      return index !== -1 && docs[index] ? docs[index].fileUrl : '';
    };

    const addressObj: any = store.addresses && store.addresses.length > 0 ? store.addresses[0] : null;
    let addressStr = '';
    let openingTime = '';
    let closingTime = '';

    if (addressObj) {
      addressStr = `${addressObj.streetAddress}, ${addressObj.city}, ${addressObj.state} - ${addressObj.pinCode}`;
      openingTime = addressObj.openingTime;
      closingTime = addressObj.closingTime;
    }

    const payload = {
      LoginUser: true,
      ContactNumber: business.mobileNumber || '',
      Email: business.email || '',
      MerchantName: business.ownerName || business.businessName || '',
      StoreName: business.businessName || '',
      Address: addressStr,
      GSTIN: business.gstNumber || '',
      BusinessType: business.businessType || '',
      PanNumber: business.panNumber || '',
      OwnerName: business.ownerName || '',
      MobileNumber: business.mobileNumber || '',
      EmailId: business.email || '',
      BrandName: brand.brandName || '',
      WebsiteURL: brand.website || '',
      LogoURL: brand.logoUrl || '',
      BrandDescription: brand.description || '',
      OpeningTime: openingTime,
      ClosingTime: closingTime,
      AccountHolderName: bank.accountHolderName || '',
      BankName: bank.bankName || '',
      AccountNumber: bank.accountNumber || '',
      IfscCode: bank.ifscCode || '',
      GSTCertificateURL: getDocUrl('GST Certificate'),
      BusinessLicenceURL: getDocUrl('Business License'),
      FSSAICertificateURL: getDocUrl('FSSAI Certificate')
    };

    this.errorMessage = '';
    this.isSubmitting = true;
    this.http.post(`${this.merchantService.baseUrl}/dev/merchant/auth/register-details`, payload)
      .subscribe({
        next: (res: any) => {
          this.isSubmitting = false;
          if (res.error) {
            this.errorMessage = res.error.message || 'Registration failed';
            return;
          }
          console.log('Registration successful', res);
          if (this.stepper) {
            this.stepper.next();
          }
          // alert('Registration successful');
          // this.router.navigate(['/login']);
        },
        error: (err) => {
          this.isSubmitting = false;
          console.error('Registration failed', err);
          this.errorMessage = err.error?.error?.message || err.error?.message || 'Registration failed. Please try again.';
        }
      });
  }

  createAddressForm(): FormGroup {
    return this.fb.group({
      streetAddress: ['', Validators.required],

      city: ['', Validators.required],

      state: ['', Validators.required],

      pinCode: ['', Validators.required],

      openingTime: ['', Validators.required],

      closingTime: ['', Validators.required],

      workingDays: [['Mon', 'Tue', 'Wed', 'Thu', 'Fri']],
    });
  }

  initializeDocuments() {
    this.documentList.forEach((doc) => {
      this.documents.push(
        this.fb.group({
          fileUrl: ['', doc.required ? Validators.required : []],
          fileName: [''],
          isUploading: [false],
        }),
      );
    });
  }

  onFileSelected(event: Event, index: number) {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    const file = input.files[0];
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];

    if (!allowedTypes.includes(file.type)) {
      alert('Only PDF, JPG, JPEG and PNG files are allowed.');
      input.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Maximum file size is 5 MB.');
      input.value = '';
      return;
    }

    const docGroup = this.documents.at(index);
    docGroup.patchValue({ isUploading: true, fileName: file.name });
    this.cdr.detectChanges();

    const reader = new FileReader();

    reader.onload = () => {
      this.zone.run(() => {
        const base64String = (reader.result as string).split(',')[1];
        const payload = {
          base64: base64String,
          fileName: file.name,
          contentType: file.type,
          folder: 'documents'
        };

        this.http.post(`${this.merchantService.baseUrl}/dev/merchant/upload-files`, payload)
          .subscribe({
            next: (res: any) => {
              console.log('Document upload response:', res);
              try {
                let parsedRes = res;
                if (typeof res === 'string') {
                  parsedRes = JSON.parse(res);
                }
                if (parsedRes && parsedRes.success) {
                  docGroup.patchValue({ fileUrl: parsedRes.data?.url || parsedRes.url, isUploading: false });
                } else {
                  console.error('Upload failed message:', parsedRes?.message);
                  alert('Upload failed: ' + (parsedRes?.message || 'Unknown error'));
                  docGroup.patchValue({ isUploading: false, fileName: '' });
                }
              } catch (e) {
                console.error('Parsing error', e);
                alert('Upload failed due to parse error.');
                docGroup.patchValue({ isUploading: false, fileName: '' });
              }
              this.cdr.detectChanges();
            },
            error: (err) => {
              console.error('Upload error', err);
              alert('Upload failed');
              docGroup.patchValue({ isUploading: false, fileName: '' });
              this.cdr.detectChanges();
            }
          });
      });
    };

    reader.readAsDataURL(file);
  }

  removeFile(index: number, event: MouseEvent) {
    event.stopPropagation();

    this.documents.at(index).patchValue({
      fileUrl: '',
      fileName: '',
      isUploading: false
    });
  }

  removeLogo(event: Event, input: HTMLInputElement) {
    event.stopPropagation();
    this.brandForm.patchValue({ logoUrl: '' });
    input.value = '';
    this.cdr.detectChanges();
  }

  onLogoSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    const file = input.files[0];
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];

    if (!allowedTypes.includes(file.type)) {
      alert('Only JPG, JPEG and PNG files are allowed.');
      input.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Maximum file size is 5 MB.');
      input.value = '';
      return;
    }

    this.isUploadingLogo = true;
    this.cdr.detectChanges();

    const reader = new FileReader();

    reader.onload = () => {
      this.zone.run(() => {
        const base64String = (reader.result as string).split(',')[1];
        const payload = {
          base64: base64String,
          fileName: file.name,
          contentType: file.type,
          folder: 'uploads'
        };

        this.http.post(`${this.merchantService.baseUrl}/dev/merchant/upload-files`, payload)
          .subscribe({
            next: (res: any) => {
              this.isUploadingLogo = false;
              console.log('Upload response:', res);
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
                  this.brandForm.patchValue({ logoUrl: uploadedUrl });
                } else if (parsedRes && parsedRes.success) {
                  this.brandForm.patchValue({ logoUrl: parsedRes.data?.url || parsedRes.url });
                } else {
                  console.error('Upload failed message:', parsedRes?.message);
                  alert('Upload failed: ' + (parsedRes?.message || 'Invalid response from server'));
                }
              } catch (e) {
                console.error('Parsing error', e);
              }
              this.cdr.detectChanges();
            },
            error: (err) => {
              console.error('Upload error', err);
              this.isUploadingLogo = false;
              this.cdr.detectChanges();
              alert('Upload failed. Please try again.');
            }
          });
      });
    };

    reader.readAsDataURL(file);
  }
}

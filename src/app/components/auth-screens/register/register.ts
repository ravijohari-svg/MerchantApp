import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormArray, FormGroup } from '@angular/forms';

import { FormsModule } from '@angular/forms';

import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

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

  isLinear = false;

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
  });

  allCategories = ['Restaurant', 'Grocery', 'Pharmacy', 'Electronics', 'Fashion', 'Other'];

  filteredCategories = [...this.allCategories];

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
      x.toLowerCase().includes(this.searchText.toLowerCase()),
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
    console.log(this.businessForm.value);

    console.log(this.brandForm.value);

    console.log(this.selectedCategories);
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
          file: [null, doc.required ? Validators.required : []],

          fileName: [''],
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

    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];

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

    this.documents.at(index).patchValue({
      file: file,

      fileName: file.name,
    });
  }

  removeFile(index: number, event: MouseEvent) {
    event.stopPropagation();

    this.documents.at(index).patchValue({
      file: null,
      fileName: '',
    });
  }
}

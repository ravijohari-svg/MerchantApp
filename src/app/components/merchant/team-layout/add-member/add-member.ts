
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';


import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';

interface PermissionMatrixRow {
  moduleName: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

@Component({
  selector: 'app-add-member',
 imports: [
    CommonModule,
    ReactiveFormsModule,  
    MatIconModule,       
    MatExpansionModule,  
    MatTableModule,       
  ],
  templateUrl: './add-member.html',
  styleUrl: './add-member.scss',
})
export class AddMember implements OnInit {
  inviteForm!: FormGroup;
  imagePreviewUrl: string | null = null;
  
  modulesList: string[] = [
    'Orders', 'Products', 'Inventory', 'Stores', 
    'Customers', 'Promotions', 'Payments', 'Analytics', 'Team', 'Settings'
  ];

  activePermissionsLogArray: Array<{module: string, operation: string}> = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initReactiveForm();
    this.buildPermissionsMatrix();
  }

  private initReactiveForm(): void {
    this.inviteForm = this.fb.group({
      profilePhoto: [null, Validators.required],
      fullName: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      employeeId: ['', Validators.required],
      designation: ['', Validators.required],

      selectedRole: ['', Validators.required],
      permissionsMatrix: this.fb.array([]),

      assignedStores: [[], Validators.required],
      defaultStore: ['', Validators.required],
      reportingManager: ['', Validators.required],
      employmentType: ['Part Time', Validators.required],

      username: ['', Validators.required],
      temporaryPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      accountStatus: ['Active', Validators.required],
      sendEmailInvite: [true],
      sendSmsInvite: [false],
      requirePasswordReset: [true],
      twoFactorAuth: [false]
    }, { validators: this.passwordMatchValidator });
  }

  get permissionsArray(): FormArray {
    return this.inviteForm.get('permissionsMatrix') as FormArray;
  }

  private buildPermissionsMatrix(): void {
    this.modulesList.forEach(module => {
      this.permissionsArray.push(this.fb.group({
        moduleName: [module],
        view: [true], 
        create: [false],
        edit: [false],
        delete: [false]
      }));
    });
    this.synchronizePermissionsArray();
  }

  onPermissionChange(): void {
    this.synchronizePermissionsArray();
  }

  private synchronizePermissionsArray(): void {
    this.activePermissionsLogArray = [];
    this.permissionsArray.controls.forEach(control => {
      const val = control.value as PermissionMatrixRow;
      const keys: Array<keyof Omit<PermissionMatrixRow, 'moduleName'>> = ['view', 'create', 'edit', 'delete'];
      keys.forEach(op => {
        if (val[op] === true) {
          this.activePermissionsLogArray.push({
            module: val.moduleName,
            operation: op
          });
        }
      });
    });
    console.log('Maintained Tracked Permissions Array State:', this.activePermissionsLogArray);
  }

  passwordMatchValidator(g: FormGroup) {
    const pass = g.get('temporaryPassword')?.value;
    const confirmPass = g.get('confirmPassword')?.value;
    return pass === confirmPass ? null : { mismatch: true };
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.inviteForm.get('profilePhoto')?.setValue(file);
      this.inviteForm.get('profilePhoto')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeUploadedImage(fileInput: HTMLInputElement): void {
    fileInput.value = '';
    this.imagePreviewUrl = null;
    this.inviteForm.get('profilePhoto')?.setValue(null);
    this.inviteForm.get('profilePhoto')?.markAsTouched();
  }

  onSubmitWorkflow(): void {
    if (this.inviteForm.valid) {
      console.log('Final Validation Success Payload Summary Form:', this.inviteForm.value);
      console.log('Stored Stored System Matrix Permissions Tracker Array:', this.activePermissionsLogArray);
    } else {
      this.inviteForm.markAllAsTouched();
    }
  }
  
availableStores: string[] = [
  'KFC Sector 55',
  'KFC MG Road',
  'KFC DLF Phase 3'
];

onStoreSelect(event: Event): void {
  const selectElement = event.target as HTMLSelectElement;
  const selectedValue = selectElement.value;

  if (!selectedValue) return;

  const currentStores: string[] = this.inviteForm.get('assignedStores')?.value || [];

  if (!currentStores.includes(selectedValue)) {
    const updatedStores = [...currentStores, selectedValue];
    this.inviteForm.get('assignedStores')?.setValue(updatedStores);
    this.inviteForm.get('assignedStores')?.markAsTouched();
  }

  selectElement.value = '';
}

removeStore(storeToRemove: string): void {
  const currentStores: string[] = this.inviteForm.get('assignedStores')?.value || [];
  const updatedStores = currentStores.filter(store => store !== storeToRemove);

  this.inviteForm.get('assignedStores')?.setValue(updatedStores);
  this.inviteForm.get('assignedStores')?.markAsTouched();
}


get isStep1Valid(): boolean {
  const fields = [
    'profilePhoto',
    'fullName',
    'emailAddress',
    'mobileNumber',
    'employeeId',
    'designation'
  ];
  return fields.every(field => this.inviteForm.get(field)?.valid);
}

get isStep2Valid(): boolean {
  const isRoleValid = !!this.inviteForm.get('selectedRole')?.valid;
  const isMatrixValid = this.inviteForm.get('permissionsMatrix')?.valid ?? true;
  return isRoleValid && isMatrixValid;
}

get isStep3Valid(): boolean {
  const fields = ['assignedStores', 'defaultStore', 'reportingManager', 'employmentType'];
  const fieldsValid = fields.every(field => this.inviteForm.get(field)?.valid);
  
  const assignedStores = this.inviteForm.get('assignedStores')?.value;
  const hasStores = Array.isArray(assignedStores) && assignedStores.length > 0;

  return fieldsValid && hasStores;
}

get isStep4Valid(): boolean {
  const fields = ['username', 'temporaryPassword', 'confirmPassword', 'accountStatus'];
  const fieldsValid = fields.every(field => this.inviteForm.get(field)?.valid);
  
  const passwordsMatch = !this.inviteForm.errors?.['mismatch'];

  return fieldsValid && passwordsMatch;
}


}
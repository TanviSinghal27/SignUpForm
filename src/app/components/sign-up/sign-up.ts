import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Locationdata } from '../../model/signupdata';
import { ValidationErrors } from '@angular/forms';

@Component({
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-sign-up',
  styleUrl: './sign-up.css',
  templateUrl: './sign-up.html',
})
export class SignUp implements OnInit {
  private fb = inject(FormBuilder);
  signUpForm!: FormGroup;
  locationDb: Locationdata = {
    India: {
      Maharashtra: ['Mumbai', 'Pune', 'Nagpur'],
      Karnataka: ['Bengaluru', 'Mysuru', 'Hubli'],
    },
    USA: {
      California: ['Los Angeles', 'San Francisco', 'San Diego'],
      Texas: ['Houston', 'Austin', 'Dallas'],
    },
  };

  formFieldsOrder: string[] = [
    'name',
    'email',
    'mobile',
    'password',
    'confirmPassword',
    'gender',
    'country',
    'state',
    'city',
  ];

  countries: string[] = Object.keys(this.locationDb);
  cities: string[] = [];
  states: string[] = [];

  ngOnInit(): void {
    this.initForm();
    this.listenToDropdownChanges();
  }

  private initForm(): void {
    this.signUpForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
        gender: ['', [Validators.required]],
        country: ['', [Validators.required]],
        state: ['', [Validators.required]],
        city: ['', [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      },
    );
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmpassword = control.get('confirmPassword');
    if (!password || !confirmpassword) return null;
    if (password.value !== confirmpassword.value) {
      confirmpassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      if (confirmpassword.hasError('passwordMismatch')) {
        const remainingErrors = { ...confirmpassword.errors };
        delete remainingErrors['passwordMismatch'];
        confirmpassword.setErrors(Object.keys(remainingErrors).length ? remainingErrors : null);
      }
      return null;
    }
  }

  private listenToDropdownChanges(): void {
    this.signUpForm.get('country')?.valueChanges.subscribe((country) => {
      this.states = country ? Object.keys(this.locationDb[country] || {}) : [];
      this.cities = [];
      this.signUpForm.patchValue({ state: '', city: '' });
    });

    this.signUpForm.get('state')?.valueChanges.subscribe((state) => {
      const currentCountry = this.signUpForm.get('country')?.value;
      this.cities = currentCountry && state ? this.locationDb[currentCountry][state] || [] : [];
      this.signUpForm.patchValue({ city: '' });
    });
  }
  isInvalid(controlName: string): boolean {
    const control = this.signUpForm.get(controlName);
    // return !!(control && control.invalid && (control.dirty || control.touched));
    if (!control || !control.invalid) return false;
    if (control.touched || control.dirty) return true;
    const currentIndex = this.formFieldsOrder.indexOf(controlName);
    const hasSkippedAhead = this.formFieldsOrder.slice(currentIndex + 1).some((field) => {
      return this.signUpForm.get(field)?.touched;
    });
    // return !!(control && control.invalid);
    return hasSkippedAhead;
  }

  onSubmit(): void {
    if (this.signUpForm.valid) {
      (console.log('Form Submitted Successfullly:'), this.signUpForm.value);
    } else {
      this.signUpForm.markAllAsTouched();
    }
  }
}

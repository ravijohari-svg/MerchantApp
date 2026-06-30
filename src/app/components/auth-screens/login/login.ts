import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { AuthApiService } from '../../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports:[CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  mode: 'email' | 'mobile' = 'email';
  email = '';
  password = '';

  mobile = '';
  showOtpInput = false;
  otp = '';
  resendSeconds = 0;
  private _resendTimer: any = null;

  constructor(private authApiService : AuthApiService , private router: Router){
  }

  setMode(m: 'email' | 'mobile') {
    this.mode = m;
    // reset mobile/otp state when switching
    if (m === 'email') {
      this.showOtpInput = false;
      this.otp = '';
    }
  }

  get primaryLabel() {
    if (this.mode === 'email') return 'Sign In';
    return this.showOtpInput ? 'Verify & Sign in' : 'Sign In';
  }

  get primaryDisabled() {
    if (this.mode === 'email') return !this.email || !this.password;
    if (this.mode === 'mobile') return !this.showOtpInput; // disable until OTP shown
    return false;
  }

  sendOtp() {
    if (!this.mobile) {
      alert('Please enter mobile number first');
      return;
    }
    // Simulate sending OTP and start resend countdown
    this.showOtpInput = true;
    this.otp = '';
    this.startResendCountdown();
  }

  onPrimaryAction() {
    if (this.mode === 'email') {
      this.signInWithEmail();
      return;
    }

    if (this.mode === 'mobile') {
      if (!this.showOtpInput) {
        alert('Please click Send OTP first');
        return;
      }
      this.verifyOtpAndSignIn();
    }
  }

  signInWithEmail() {
    // Replace with real authentication call
    // alert(`Signing in with email: ${this.email}`);
    let payload = {
      Email: this.email
    }

     this.router.navigate(['/merchant']);
    return;
    
  this.authApiService.login(payload).subscribe({
    next: (res: any) => {
      console.log('Login success:', res);

      // example: store token if API returns it
      localStorage.setItem('token', res.token);

      alert('Login successful');
    },

    error: (err: any) => {
      console.error('Login failed:', err);
      alert('Login failed');
    }
  });
  }

  verifyOtpAndSignIn() {
    if (this.otp && this.otp.length === 6) {
      // Replace with real verification logic
      alert(`Verified OTP ${this.otp} for ${this.mobile}. Signing in...`);
    } else {
      alert('Please enter the 6 digit OTP');
    }
  }

  // Combined handler for mobile action button
  onSendOrVerify() {
    if (!this.showOtpInput) {
      this.sendOtp();
      return;
    }

    this.verifyOtpAndSignIn();
  }

  get mobileActionLabel() {
    return this.showOtpInput ? 'Verify & Sign In' : 'Send OTP';
  }

  get mobileActionDisabled() {
    if (!this.showOtpInput) return !this.mobile;
    return !(this.otp && this.otp.length === 6);
  }

  startResendCountdown() {
    this.resendSeconds = 60;
    if (this._resendTimer) clearInterval(this._resendTimer);
    this._resendTimer = setInterval(() => {
      this.resendSeconds -= 1;
      if (this.resendSeconds <= 0) {
        clearInterval(this._resendTimer);
        this._resendTimer = null;
        this.resendSeconds = 0;
      }
    }, 1000);
  }

  resendOtp() {
    if (!this.mobile) {
      alert('Enter mobile number first');
      return;
    }
    // trigger resend
    alert('Resending OTP...');
    this.startResendCountdown();
  }
}

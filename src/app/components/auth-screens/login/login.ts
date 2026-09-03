import { CommonModule } from '@angular/common';
import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthApiService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login implements OnDestroy {
  mode: 'email' | 'mobile' | 'forgot' = 'email';
  email = '';
  password = '';
  showPassword = false;
  loginError: string | null = null;

  mobile = '';
  mobileOtpVisible = false;
  mobileOtp = '';

  otpRequested = false;
  passwordStepVisible = false;
  otp = '';
  newPassword = '';
  confirmPassword = '';

  resendSeconds = 0;
  private _resendTimer: any = null;

  constructor(private authApiService: AuthApiService, private router: Router, private cdr: ChangeDetectorRef) { }

  setMode(mode: 'email' | 'mobile' | 'forgot') {
    this.mode = mode;
    this.loginError = null;
    if (mode !== 'forgot') {
      this.resetForgotState();
    }
    if (mode !== 'mobile') {
      this.mobileOtpVisible = false;
      this.mobileOtp = '';
    }
  }

  get primaryLabel() {
    if (this.mode === 'email') return 'Sign In';
    if (this.mode === 'mobile') return this.mobileOtpVisible ? 'Verify & Sign In' : 'Send OTP';
    if (!this.otpRequested) return 'Send OTP';
    return this.passwordStepVisible ? 'Reset Password' : 'Verify OTP';
  }

  get primaryDisabled() {
    if (this.mode === 'email') {
      return !this.email || !this.password;
    }

    if (this.mode === 'mobile') {
      return this.mobileOtpVisible ? !this.mobileOtp || this.mobileOtp.length !== 6 : !this.mobile;
    }

    if (!this.email) return true;
    if (!this.otpRequested) return false;
    if (!this.passwordStepVisible) return !this.otp || this.otp.length !== 6;

    return (
      !this.otp ||
      this.otp.length !== 6 ||
      !this.newPassword ||
      !this.confirmPassword ||
      this.newPassword !== this.confirmPassword
    );
  }

  onPrimaryAction() {
    if (this.mode === 'email') {
      this.signInWithEmail();
      return;
    }

    if (this.mode === 'mobile') {
      if (!this.mobileOtpVisible) {
        this.sendMobileOtp();
        return;
      }

      this.verifyMobileOtpAndSignIn();
      return;
    }

    if (!this.otpRequested) {
      this.sendOtp();
      return;
    }

    if (!this.passwordStepVisible) {
      if (!this.otp || this.otp.length !== 6) {
        alert('Please enter the 6 digit OTP');
        return;
      }

      this.passwordStepVisible = true;
      return;
    }

    this.resetPassword();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  openForgotPassword() {
    this.mode = 'forgot';
    this.resetForgotState();
    this.loginError = null;
  }

  openMobileLogin() {
    this.mode = 'mobile';
  }

  sendMobileOtp() {
    if (!this.mobile) {
      alert('Please enter your mobile number first');
      return;
    }

    this.mobileOtpVisible = true;
    this.mobileOtp = '';
  }

  verifyMobileOtpAndSignIn() {
    if (!this.mobileOtp || this.mobileOtp.length !== 6) {
      alert('Please enter the 6 digit OTP');
      return;
    }

    alert(`Verified OTP ${this.mobileOtp} for ${this.mobile}. Signing in...`);
  }

  sendOtp() {
    if (!this.email) {
      alert('Please enter your email address first');
      return;
    }

    const payload = {
      UserName: this.email,
    };

    this.authApiService.forgotPassword(payload).subscribe({
      next: () => {
        this.otpRequested = true;
        this.passwordStepVisible = false;
        this.otp = '';
        this.newPassword = '';
        this.confirmPassword = '';
        this.startResendCountdown();
      },
      error: (err: any) => {
        console.error('Forgot password request failed:', err);
      },
    });
  }

  resetPassword() {
    if (!this.otp || this.otp.length !== 6) {
      alert('Please enter the 6 digit OTP');
      return;
    }

    if (!this.newPassword || !this.confirmPassword) {
      alert('Please enter and confirm your new password');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const payload = {
      UserName: this.email,
      VerificationCode: this.otp,
      Password: this.newPassword,
    };

    this.authApiService.resetPassword(payload).subscribe({
      next: () => {
        alert('Password reset successfully');
        this.resetForgotState();
        this.setMode('email');
      },
      error: (err: any) => {
        console.error('Reset password failed:', err);
      },
    });
  }

  resendOtp() {
    if (!this.email) {
      alert('Enter email address first');
      return;
    }

    this.sendOtp();
  }

  backToOtpStep() {
    this.passwordStepVisible = false;
    this.newPassword = '';
    this.confirmPassword = '';
  }

  private resetForgotState() {
    this.otpRequested = false;
    this.passwordStepVisible = false;
    this.otp = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.resendSeconds = 0;

    if (this._resendTimer) {
      clearInterval(this._resendTimer);
      this._resendTimer = null;
    }
  }

  private startResendCountdown() {
    this.resendSeconds = 60;

    if (this._resendTimer) {
      clearInterval(this._resendTimer);
    }

    this._resendTimer = setInterval(() => {
      this.resendSeconds -= 1;
      if (this.resendSeconds <= 0) {
        clearInterval(this._resendTimer);
        this._resendTimer = null;
        this.resendSeconds = 0;
      }
    }, 1000);
  }

  private signInWithEmail() {
    const payload = {
      Email: this.email,
      Password: this.password,
    };

    this.loginError = null;
    this.authApiService.login(payload).subscribe({
      next: (res: any) => {
        // If the API returns 200 OK but includes the error object in the response body
        if (res && res.error && res.error.message) {
          this.loginError = res.error.message;
          this.cdr.detectChanges();
          return;
        }

        const tokenData = res?.data || res;
        const tokenString = typeof tokenData === 'object' ? JSON.stringify(tokenData) : tokenData;
        localStorage.setItem('token', tokenString);
        this.router.navigate(['/merchant']);
      },
      error: (err: any) => {
        // alert("API Error details: " + JSON.stringify(err));
        console.error('Login failed:', err);
        // Handle HttpErrorResponse and custom error formats
        if (err?.error?.error?.message) {
          this.loginError = err.error.error.message;
        } else if (err?.error?.message) {
          this.loginError = err.error.message;
        } else if (err?.message) {
          this.loginError = err.message;
        } else {
          this.loginError = 'Login failed. Please try again.';
        }
        this.cdr.detectChanges();
      },
    });
  }

  ngOnDestroy() {
    if (this._resendTimer) {
      clearInterval(this._resendTimer);
    }
  }
}

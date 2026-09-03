import { Component, inject, OnInit } from '@angular/core';
import { LayoutService } from '../../../services/layout.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  protected readonly layoutService = inject(LayoutService);

  userProfile = {
    name: 'Merchant Owner',
    role: 'Merchant Owner',
    initials: 'M'
  };

  currentRole = 'Demo: Owner';

  ngOnInit(): void {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const parsedToken = JSON.parse(token);
        // Check both root level and nested merchantBrand/merchant for Email
        const email = parsedToken?.merchantBrand?.Email || parsedToken?.merchantBrand?.email || 
                      parsedToken?.merchant?.Email || parsedToken?.merchant?.email ||
                      parsedToken?.email || parsedToken?.Email || parsedToken?.username || 'Merchant Owner';
        this.userProfile.name = email;
        this.userProfile.initials = email && email !== 'Merchant Owner' ? email.charAt(0).toUpperCase() : 'M';
      }
    } catch (e) {
      console.warn('Could not parse token from localStorage in header');
    }
  }
}

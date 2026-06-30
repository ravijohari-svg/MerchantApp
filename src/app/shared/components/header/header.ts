import { Component, inject } from '@angular/core';
import { LayoutService } from '../../../services/layout.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected readonly layoutService = inject(LayoutService);

  userProfile = {
    name: 'Ravi Kumar Sharma',
    role: 'Merchant Owner',
    initials: 'RK'
  };

  currentRole = 'Demo: Owner';
}


import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';

export interface TeamMember {
  initials: string;
  avatarClass: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  roleClass: string;
  assignedStores: string;
  status: 'Active' | 'Inactive';
  lastLogin: string;
  logins: number;
  showDelete: boolean;
}

@Component({
  selector: 'app-team-list',
  imports: [
    CommonModule,   
    MatTableModule,  
    MatIconModule,
    RouterLink
  ],
  templateUrl: './team-list.html',
  styleUrl: './team-list.scss',
})
export class TeamList implements OnInit {
  
  displayedColumns: string[] = [
    'member', 
    'email', 
    'role', 
    'assignedStores', 
    'status', 
    'lastLogin', 
    'logins', 
    'actions'
  ];

  teamData: TeamMember[] = [
    {
      initials: 'RK',
      avatarClass: 'dark-blue-avatar',
      name: 'Ravi Kumar Sharma',
      phone: '+91 98765 43210',
      email: 'ravi@kfc.in',
      role: 'Merchant Owner',
      roleClass: 'badge-indigo',
      assignedStores: 'All Stores',
      status: 'Active',
      lastLogin: '2 min ago',
      logins: 284,
      showDelete: false
    },
    {
      initials: 'PM',
      avatarClass: 'purple-avatar',
      name: 'Priya Mehta',
      phone: '+91 87654 32109',
      email: 'priya@kfc.in',
      role: 'Store Manager',
      roleClass: 'badge-green',
      assignedStores: 'KFC - Sector 55',
      status: 'Active',
      lastLogin: '1 hr ago',
      logins: 142,
      showDelete: true
    },
    {
      initials: 'AS',
      avatarClass: 'green-avatar',
      name: 'Anita Sharma',
      phone: '+91 21098 76543',
      email: 'anita@kfc.in',
      role: 'Staff',
      roleClass: 'badge-slate',
      assignedStores: 'KFC - Sector 29',
      status: 'Inactive',
      lastLogin: '3 days ago',
      logins: 15,
      showDelete: true
    }
  ];

  dataSource = new MatTableDataSource<TeamMember>(this.teamData);

  constructor(private router: Router) {}
  ngOnInit(): void {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  inviteMember(){
     this.router.navigate(['merchant/team/add-member']);
  }
}
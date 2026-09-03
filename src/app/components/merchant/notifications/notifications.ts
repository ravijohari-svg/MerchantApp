import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface NotificationItem {
  id: string;
  message: string;
  time: string;
  unread: boolean;
  type: 'order' | 'store' | 'payment' | 'system' | 'support' | 'account';
}


@Component({
  selector: 'app-notifications',
  imports: [CommonModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.scss',
})

export class Notifications {
  notifications: NotificationItem[] = [
    {
      id: '1',
      message: 'New order ORD-2851 placed at Burger Hub',
      time: '2 min ago',
      unread: false,
      type: 'order'
    },
    {
      id: '2',
      message: 'Order ORD-2847 is delayed — rider stuck in traffic',
      time: '8 min ago',
      unread: true,
      type: 'order'
    },
    {
      id: '3',
      message: 'Spice Garden is ready for pickup (ORD-2847)',
      time: '14 min ago',
      unread: true,
      type: 'store'
    },
    {
      id: '4',
      message: 'Settlement of ₹38,400 processed for Burger Hub',
      time: '1h ago',
      unread: false,
      type: 'payment'
    },
    {
      id: '5',
      message: 'Server maintenance scheduled for tonight 2:00–3:00 AM',
      time: '2h ago',
      unread: false,
      type: 'system'
    },
    {
      id: '6',
      message: 'Ticket TKT-1045 escalated to Level 2 support',
      time: '3h ago',
      unread: false,
      type: 'support'
    },
    {
      id: '7',
      message: '100 orders completed today — daily milestone reached!',
      time: '4h ago',
      unread: false,
      type: 'order'
    },
    {
      id: '8',
      message: 'The Taco Stand account suspended — policy violation',
      time: '5h ago',
      unread: false,
      type: 'account'
    }
  ];

  markAsRead(item: NotificationItem): void {
    item.unread = false;
  }
}
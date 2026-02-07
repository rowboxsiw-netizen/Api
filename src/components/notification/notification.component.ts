
import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../interfaces';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
})
export class NotificationComponent {
  notificationService = inject(NotificationService);
  notification = this.notificationService.notification;
  
  private timeoutId: any;

  constructor() {
    effect(() => {
      const currentNotification = this.notification();
      if (currentNotification) {
        if (this.timeoutId) {
          clearTimeout(this.timeoutId);
        }
        this.timeoutId = setTimeout(() => {
          this.notificationService.clear();
        }, 5000);
      }
    });
  }

  getBgColor(notification: Notification | null): string {
    if (!notification) return '';
    switch (notification.type) {
      case 'success':
        return 'bg-green-600';
      case 'error':
        return 'bg-red-600';
      case 'info':
        return 'bg-blue-600';
      default:
        return 'bg-gray-700';
    }
  }

  close() {
    this.notificationService.clear();
  }
}

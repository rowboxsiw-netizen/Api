
import { ChangeDetectionStrategy, Component, signal, inject, computed, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { NotificationService } from '../../services/notification.service';
import { User, ApiKey } from '../../interfaces';

declare var Chart: any;

type AdminView = 'dashboard' | 'users' | 'apiKeys' | 'apiDocs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  templateUrl: './admin-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent implements AfterViewInit {
  authService = inject(AuthService);
  dataService = inject(DataService);
  notificationService = inject(NotificationService);
  private fb = inject(FormBuilder);
  
  @ViewChild('dailyRegistrationsChart') chartRef!: ElementRef<HTMLCanvasElement>;
  private chart: any;

  currentView = signal<AdminView>('dashboard');
  userSearchTerm = signal('');
  
  filteredUsers = computed(() => {
    const term = this.userSearchTerm().toLowerCase();
    return this.dataService.users().filter(user => 
      user.fullName.toLowerCase().includes(term) || user.email.toLowerCase().includes(term)
    );
  });

  apiKeyForm = this.fb.group({
    name: ['', Validators.required],
    permissions: ['read-only' as 'read-only' | 'read-write', Validators.required]
  });

  ngAfterViewInit() {
    this.createChart();
  }
  
  setView(view: AdminView) {
    this.currentView.set(view);
    if (view === 'dashboard' && this.chartRef) {
        setTimeout(() => this.createChart(), 0);
    }
  }

  onUserSearch(event: Event) {
    this.userSearchTerm.set((event.target as HTMLInputElement).value);
  }

  createApiKey() {
    if (this.apiKeyForm.valid) {
      const { name, permissions } = this.apiKeyForm.value;
      const adminEmail = this.authService.currentUser()?.email;
      if (adminEmail) {
        this.dataService.createApiKey(name!, permissions!, null, adminEmail)
          .then(() => {
            this.notificationService.show('API Key created successfully!', 'success');
            this.apiKeyForm.reset({ permissions: 'read-only' });
          })
          .catch(err => this.notificationService.show(err.message, 'error'));
      }
    }
  }

  deleteApiKey(keyId: string) {
    if (confirm('Are you sure you want to revoke this API key?')) {
      this.dataService.deleteApiKey(keyId)
        .then(() => this.notificationService.show('API Key revoked.', 'success'))
        .catch(err => this.notificationService.show(err.message, 'error'));
    }
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      this.notificationService.show('Copied to clipboard!', 'info');
    });
  }

  exportUsersToCSV() {
    const users = this.filteredUsers();
    if (users.length === 0) {
      this.notificationService.show('No users to export.', 'info');
      return;
    }
    const header = 'UID,Full Name,Email,Phone,Created At\n';
    const rows = users.map(u => `${u.uid},"${u.fullName}","${u.email}","${u.phone}",${u.createdAt}`).join('\n');
    const csv = header + rows;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'users.csv');
    a.click();
  }

  createChart() {
    if (!this.chartRef || !this.chartRef.nativeElement) {
      return;
    }
    const users = this.dataService.users();
    const registrationsByDay: { [key: string]: number } = {};
    
    users.forEach(user => {
        const date = new Date(user.createdAt).toLocaleDateString();
        registrationsByDay[date] = (registrationsByDay[date] || 0) + 1;
    });

    const labels = Object.keys(registrationsByDay);
    const data = Object.values(registrationsByDay);

    const ctx = this.chartRef.nativeElement.getContext('2d');
    if (!ctx) return;
    
    if (this.chart) {
      this.chart.destroy();
    }
    
    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: 'Daily Registrations',
          data: data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
             labels: {
              color: '#D1D5DB' // text color for legend
            }
          },
          title: {
            display: true,
            text: 'User Registrations by Day',
            color: '#F9FAFB' // text color for title
          }
        }
      }
    });
  }
}

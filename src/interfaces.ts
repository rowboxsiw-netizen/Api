
export interface User {
  uid: string;
  fullName: string;
  email: string;
  phone: string;
  createdAt: string;
  isVerified: boolean;
}

export interface ApiKey {
  id: string;
  key: string;
  name: string;
  createdBy: string;
  createdAt: string;
  expiresAt: string | null;
  permissions: 'read-only' | 'read-write';
  isActive: boolean;
}

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
}

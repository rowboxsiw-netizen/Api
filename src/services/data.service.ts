
import { Injectable, signal } from '@angular/core';
import { ref, onValue, push, set, remove } from 'firebase/database';
import { firebaseDatabase } from '../firebase.config';
import { User, ApiKey } from '../interfaces';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  users = signal<User[]>([]);
  apiKeys = signal<ApiKey[]>([]);

  constructor() {
    this.listenToUsers();
    this.listenToApiKeys();
  }

  private listenToUsers() {
    const usersRef = ref(firebaseDatabase, 'users');
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      const usersArray = data ? Object.keys(data).map(key => ({ ...data[key], uid: key })) : [];
      this.users.set(usersArray);
    });
  }

  private listenToApiKeys() {
    const apiKeysRef = ref(firebaseDatabase, 'apiKeys');
    onValue(apiKeysRef, (snapshot) => {
      const data = snapshot.val();
      const apiKeysArray = data ? Object.keys(data).map(key => ({ ...data[key], id: key })) : [];
      this.apiKeys.set(apiKeysArray);
    });
  }

  createApiKey(name: string, permissions: 'read-only' | 'read-write', expiresAt: string | null, createdBy: string): Promise<void> {
    const newApiKeyRef = push(ref(firebaseDatabase, 'apiKeys'));
    const newKey = {
      id: newApiKeyRef.key,
      key: uuidv4(),
      name,
      permissions,
      expiresAt,
      createdBy,
      createdAt: new Date().toISOString(),
      isActive: true,
    };
    return set(newApiKeyRef, newKey);
  }

  deleteApiKey(keyId: string): Promise<void> {
    const apiKeyRef = ref(firebaseDatabase, `apiKeys/${keyId}`);
    return remove(apiKeyRef);
  }
}


import { Injectable, signal, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification
} from 'firebase/auth';
import { set, ref } from 'firebase/database';
import { firebaseAuth, firebaseDatabase } from '../firebase.config';
import { NotificationService } from './notification.service';
import { from, Observable, of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly adminEmail = 'rowboxsiw@gmail.com';
  
  currentUser = signal<User | null>(null);

  constructor(private router: Router, private notificationService: NotificationService, private ngZone: NgZone) {
    onAuthStateChanged(firebaseAuth, (user) => {
      this.ngZone.run(() => {
        this.currentUser.set(user);
      });
    });
  }

  register(fullName: string, email: string, password: string, phone: string): Observable<User> {
    return from(createUserWithEmailAndPassword(firebaseAuth, email, password)).pipe(
      switchMap(userCredential => {
        const user = userCredential.user;
        const userData = {
          uid: user.uid,
          fullName,
          email,
          phone,
          createdAt: new Date().toISOString(),
          isVerified: false
        };
        return from(set(ref(firebaseDatabase, 'users/' + user.uid), userData)).pipe(
          switchMap(() => from(sendEmailVerification(user))),
          map(() => {
            this.notificationService.show('Registration successful! Please check your email to verify your account.', 'success');
            return user;
          })
        );
      }),
      catchError(error => {
        if (error.code === 'auth/email-already-in-use') {
          this.notificationService.show('This email is already in use. Please try a different email or log in.', 'error');
        } else {
          this.notificationService.show(error.message, 'error');
        }
        throw error;
      })
    );
  }

  login(email: string, password: string): Observable<User> {
    return from(signInWithEmailAndPassword(firebaseAuth, email, password)).pipe(
      map(userCredential => userCredential.user),
      tap(user => {
        if (user.email === this.adminEmail) {
          this.notificationService.show('Admin login successful!', 'success');
          this.router.navigate(['/admin']);
        } else {
          signOut(firebaseAuth);
          this.notificationService.show('Access denied. Only admins can log in here.', 'error');
          throw new Error('Not an admin');
        }
      }),
      catchError(error => {
        this.notificationService.show(error.message, 'error');
        throw error;
      })
    );
  }

  logout() {
    signOut(firebaseAuth).then(() => {
      this.notificationService.show('You have been logged out.', 'info');
      this.router.navigate(['/admin-login']);
    });
  }

  isAdminUser(): Observable<boolean> {
      return new Observable(subscriber => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, user => {
            if (user && user.email === this.adminEmail) {
                subscriber.next(true);
            } else {
                subscriber.next(false);
            }
            subscriber.complete();
        });
        return () => unsubscribe();
    });
  }
}

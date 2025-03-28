import { inject, Injectable } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
  UserCredential,
} from '@angular/fire/auth';
import { map, Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);

  register(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  register$(email: string, password: string): Observable<UserCredential> {
    return from(this.register(email, password));
  }

  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  login$(email: string, password: string): Observable<UserCredential> {
    return from(this.login(email, password));
  }

  logout(): Promise<void> {
    return signOut(this.auth);
  }

  logout$(): Observable<void> {
    return from(this.logout());
  }

  getUserData(): FirebaseUser | null {
    return this.auth.currentUser;
  }

  getUserData$(): Observable<FirebaseUser | null> {
    return new Observable(subscriber => {
      const unsubscribe = onAuthStateChanged(this.auth, user => {
        subscriber.next(user);
      });
      return () => unsubscribe();
    });
  }

  getUserUid(): string | undefined {
    return this.getUserData()?.uid;
  }

  isLoggedIn$(): Observable<boolean> {
    return authState(this.auth).pipe(map(user => !!user));
  }
}

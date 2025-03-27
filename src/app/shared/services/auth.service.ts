import { inject, Injectable } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
} from '@angular/fire/auth';
import { map, Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);

  isLoggedIn(): Observable<boolean> {
    return authState(this.auth).pipe(map(user => !!user));
  }

  register(email: string, password: string): Observable<UserCredential> {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  login(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  logout(): Promise<void> {
    return signOut(this.auth);
  }

  getCurrentUserId(): string | undefined {
    const user = this.auth.currentUser;
    if (user !== null) {
      return user.uid;
    } else {
      return undefined;
    }
  }
}

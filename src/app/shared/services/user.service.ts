import { inject, Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { FirestoreBaseService } from './firestore-base.service';
import { WhereFilterOp } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseService = inject(FirestoreBaseService);

  private collectionName = 'Users';

  createUser(user: User): Promise<void> {
    return this.baseService.createWithId(this.collectionName, user);
  }

  createUserWithAutoId(user: User): Promise<void> {
    return this.baseService.create(this.collectionName, user);
  }

  getUserById(id: string): Promise<User | null> {
    return this.baseService.getById(this.collectionName, id);
  }

  getUserById$(id: string): Observable<User | null> {
    return from(this.getUserById(id));
  }

  getAllUsers(): Promise<User[]> {
    return this.baseService.getAll(this.collectionName);
  }

  // TODO
  // getAllUsers$(): Observable<User[]> {}

  getUsersByField(fieldPath: string, opStr: WhereFilterOp, value: unknown): Promise<User[]> {
    return this.baseService.getByField(this.collectionName, fieldPath, opStr, value);
  }

  // TODO
  // getUsersByField$(): Observable<User[]> {}

  updateUser(id: string, user: Partial<User>): Promise<void> {
    return this.baseService.update(this.collectionName, id, user);
  }

  deleteUser(id: string): Promise<void> {
    return this.baseService.delete(this.collectionName, id);
  }
}

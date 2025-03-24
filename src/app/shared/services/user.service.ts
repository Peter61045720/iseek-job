import { inject, Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { FirestoreBaseService } from './firestore-base.service';
import { DocumentData } from '@angular/fire/firestore';

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

  getUserById(id: string): Promise<DocumentData | null> {
    return this.baseService.getById(this.collectionName, id);
  }

  updateUser(id: string, user: Partial<User>): Promise<void> {
    return this.baseService.update(this.collectionName, id, user);
  }

  deleteUser(id: string): Promise<void> {
    return this.baseService.delete(this.collectionName, id);
  }
}

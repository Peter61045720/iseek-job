import { inject, Injectable } from '@angular/core';
import { FirestoreBaseService } from './firestore-base.service';
import { Contact } from '../models/contact.model';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private baseService = inject(FirestoreBaseService);

  private collectionName = 'Contacts';

  createContact(contact: Contact): Promise<void> {
    return this.baseService.createWithId(this.collectionName, contact);
  }

  getContactById(id: string): Promise<Contact | null> {
    return this.baseService.getById(this.collectionName, id);
  }

  updateContact(id: string, contact: Partial<Contact>): Promise<void> {
    return this.baseService.update(this.collectionName, id, contact);
  }

  updateContact$(id: string, contact: Partial<Contact>): Observable<void> {
    return from(this.updateContact(id, contact));
  }

  deleteContact(id: string): Promise<void> {
    return this.baseService.delete(this.collectionName, id);
  }
}

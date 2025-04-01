import { inject, Injectable } from '@angular/core';
import { FirestoreBaseService } from './firestore-base.service';
import { Contact } from '../models/contact.model';

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
}

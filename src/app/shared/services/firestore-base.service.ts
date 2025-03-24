import { inject, Injectable } from '@angular/core';
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  Firestore,
  getDoc,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirestoreBaseService<T extends { id: string }> {
  private firestore = inject(Firestore);

  createWithId(collectionName: string, data: T): Promise<void> {
    const docRef = doc(this.firestore, `${collectionName}/${data.id}`);
    return setDoc(docRef, data);
  }

  create(collectionName: string, data: T): Promise<void> {
    const id = doc(collection(this.firestore, collectionName)).id;
    const docRef = doc(this.firestore, `${collectionName}/${id}`);
    data.id = id;
    return setDoc(docRef, data);
  }

  async getById(collectionName: string, id: string): Promise<DocumentData | null> {
    const docRef = doc(this.firestore, `${collectionName}/${id}`);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return snapshot.data();
    } else {
      return null;
    }
  }

  update(collectionName: string, id: string, data: Partial<T>): Promise<void> {
    const docRef = doc(this.firestore, `${collectionName}/${id}`);
    return updateDoc(docRef, data as DocumentData);
  }

  delete(collectionName: string, id: string): Promise<void> {
    const docRef = doc(this.firestore, `${collectionName}/${id}`);
    return deleteDoc(docRef);
  }
}

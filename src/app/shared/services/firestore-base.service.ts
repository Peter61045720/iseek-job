import { inject, Injectable } from '@angular/core';
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  Firestore,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  QueryFieldFilterConstraint,
  QueryStartAtConstraint,
  setDoc,
  updateDoc,
  where,
  WhereFilterOp,
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

  async createWithAutoId(collectionName: string, data: T): Promise<T> {
    const docRef = doc(collection(this.firestore, collectionName));
    data.id = docRef.id;
    await setDoc(docRef, data);
    return data;
  }

  async getById(collectionName: string, id: string): Promise<T | null> {
    const docRef = doc(this.firestore, `${collectionName}/${id}`);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return snapshot.data() as T;
    } else {
      return null;
    }
  }
  getDocumentRef(collectionName: string, id: string): DocumentReference {
    return doc(this.firestore, `${collectionName}/${id}`);
  }
  async getAll(collectionName: string): Promise<T[]> {
    return (await getDocs(collection(this.firestore, collectionName))).docs.map(doc => ({
      ...doc.data(),
    })) as T[];
  }

  async countAll(collectionName: string): Promise<number> {
    const coll = collection(this.firestore, collectionName);
    const snapshot = await getCountFromServer(coll);
    return snapshot.data().count;
  }
  async countAllFiltered(
    collectionName: string,
    filters: (QueryFieldFilterConstraint | QueryStartAtConstraint)[]
  ) {
    const coll = collection(this.firestore, collectionName);

    const snapshot = await getCountFromServer(query(coll, ...filters));
    return snapshot.data().count;
  }
  async getByField(
    collectionName: string,
    fieldPath: string,
    opStr: WhereFilterOp,
    value: unknown
  ): Promise<T[]> {
    return (
      await getDocs(
        query(collection(this.firestore, collectionName), where(fieldPath, opStr, value))
      )
    ).docs.map(doc => ({ ...doc.data() })) as T[];
  }

  async getByFields(collectionName: string, filters: QueryFieldFilterConstraint[]): Promise<T[]> {
    return (await getDocs(query(collection(this.firestore, collectionName), ...filters))).docs.map(
      doc => ({ ...doc.data() })
    ) as T[];
  }
  async getDocsByFields(collectionName: string, filters: QueryFieldFilterConstraint[]) {
    return (await getDocs(query(collection(this.firestore, collectionName), ...filters))).docs;
  }
  update(collectionName: string, id: string, data: Partial<T>): Promise<void> {
    const docRef = doc(this.firestore, `${collectionName}/${id}`);
    return updateDoc(docRef, data as DocumentData);
  }

  delete(collectionName: string, id: string): Promise<void> {
    const docRef = doc(this.firestore, `${collectionName}/${id}`);
    return deleteDoc(docRef);
  }

  async getAllFiltered(
    collectionName: string,
    pageSize: number,
    currentPage: number,
    filters: (QueryFieldFilterConstraint | QueryStartAtConstraint)[]
  ): Promise<QueryDocumentSnapshot[]> {
    const docSnapshots = await getDocs(
      query(
        collection(this.firestore, collectionName),
        orderBy('date', 'desc'),
        limit(pageSize),
        ...filters
      )
    );

    return docSnapshots.docs;
  }
}

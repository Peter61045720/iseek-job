import { inject, Injectable } from '@angular/core';
import { FirestoreBaseService } from './firestore-base.service';
import { Application } from '../models/application.model';
import { DocumentReference, Timestamp, where, WhereFilterOp } from '@angular/fire/firestore';
import { ApplicationStatus } from '../enums/application-status.enum';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private baseService = inject(FirestoreBaseService<Application>);

  private collectionName = 'Applications';

  async createApplication(user_id: string, job_id: string): Promise<Application> {
    const jobRef = this.baseService.getDocumentRef('Jobs', job_id);
    const userRef = this.baseService.getDocumentRef('Users', user_id);

    //Chekk if application Exists
    const existing = await this.getApplicationByUserAndJob(userRef, jobRef);
    if (existing.length != 0) {
      throw 'Application Already Exists';
    }

    const application: Partial<Application> = {
      date: Timestamp.now(),
      job_ref: jobRef,
      user_ref: userRef,
      status: ApplicationStatus.APPLIED,
    };

    return this.baseService.createWithAutoId(this.collectionName, application);
  }

  createApplication$(user_id: string, job_id: string): Observable<Application> {
    return from(this.createApplication(user_id, job_id));
  }

  getApplicationById(id: string): Promise<Application | null> {
    return this.baseService.getById(this.collectionName, id);
  }

  deleteApplicationById(id: string) {
    return this.baseService.delete(this.collectionName, id);
  }

  getApplicationByUserAndJob(userRef: DocumentReference, jobRef: DocumentReference) {
    const filters = [where('user_ref', '==', userRef), where('job_ref', '==', jobRef)];
    return this.baseService.getByFields(this.collectionName, filters);
  }

  async withdrawByUserAndJob(user_id: string, job_id: string) {
    const jobRef = this.baseService.getDocumentRef('Jobs', job_id);
    const userRef = this.baseService.getDocumentRef('Users', user_id);

    const existing = await this.getApplicationByUserAndJob(userRef, jobRef);
    if (existing.length == 0) {
      throw 'Non existing application';
    }

    return this.deleteApplicationById(existing[0].id);
  }

  withdrawByUserAndJob$(user_id: string, job_id: string) {
    return from(this.withdrawByUserAndJob(user_id, job_id));
  }
}

import { inject, Injectable } from '@angular/core';
import { FirestoreBaseService } from './firestore-base.service';
import { Application } from '../models/application.model';
import {
  DocumentReference,
  getDoc,
  QueryDocumentSnapshot,
  QueryFieldFilterConstraint,
  QueryStartAtConstraint,
  startAfter,
  startAt,
  Timestamp,
  where,
} from '@angular/fire/firestore';
import { ApplicationStatus } from '../enums/application-status.enum';
import { from, Observable } from 'rxjs';
import { Job } from '../models/job.model';
import { User } from '../models/user.model';
import { Company } from '../models/company.model';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private baseService = inject(FirestoreBaseService<Application>);

  private collectionName = 'Applications';

  async createApplication(user_id: string, job_id: string): Promise<Application> {
    const jobRef = this.baseService.getDocumentRef('Jobs', job_id);
    const userRef = this.baseService.getDocumentRef('Users', user_id);

    //Check if application Exists
    const existing = await this.getApplicationByUserAndJob(userRef, jobRef);
    if (existing.length != 0) {
      throw 'Application Already Exists';
    }
    const user = (await this.baseService.getById('Users', userRef.id)) as User;
    const job = (await this.baseService.getById('Jobs', jobRef.id)) as Job;
    const application: Partial<Application> = {
      date: Timestamp.now(),
      job_ref: jobRef,
      user_ref: userRef,
      company_ref: job.company_ref,
      status: ApplicationStatus.APPLIED,
      allSearchKeywords: [
        ...user.usernameSearchKeywords,
        ...user.emailSearchKeywords,
        ...(job.titleSearchKeywords ?? []),
      ],
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
  deleteApplicationById$(id: string) {
    return from(this.deleteApplicationById(id));
  }
  getApplicationByUserAndJob(userRef: DocumentReference, jobRef: DocumentReference) {
    const filters = [where('user_ref', '==', userRef), where('job_ref', '==', jobRef)];
    return this.baseService.getByFields(this.collectionName, filters);
  }

  // Get all applications by job only
  getApplicationsByJob(jobRef: DocumentReference) {
    const filters = [where('job_ref', '==', jobRef)];
    return this.baseService.getByFields(this.collectionName, filters);
  }

  async getApplicationsByUser(user_id: string) {
    const userRef = this.baseService.getDocumentRef('Users', user_id);
    const filters = [where('user_ref', '==', userRef)];
    return Promise.all(
      (await this.baseService.getDocsByFields(this.collectionName, filters)).map(
        async (snapshot: QueryDocumentSnapshot) => {
          const application = snapshot.data() as Application;

          application.company = (await getDoc(application.company_ref)).data() as Company;
          application.job = (await getDoc(application.job_ref)).data() as Job;
          return application;
        }
      )
    );
  }
  getApplicationsByUser$(user_id: string) {
    return from(this.getApplicationsByUser(user_id));
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

  countAll() {
    return this.baseService.countAll(this.collectionName);
  }

  countAllFiltered(filters: Record<string, string>) {
    const customFilters = this.createFilters(filters);
    return this.baseService.countAllFiltered(this.collectionName, customFilters);
  }

  public async getAllFiltered(
    pageSize: number,
    currentPage: number,
    filters: Record<string, string>, //T[]
    dir: number,
    lastDoc: QueryDocumentSnapshot | null
  ): Promise<{ doc: QueryDocumentSnapshot; application: Application }[]> {
    const customFilters = this.createFilters(filters);

    if (currentPage !== 0) {
      if (dir == 1) customFilters.push(startAfter(lastDoc));
      if (dir == 0) customFilters.push(startAt(lastDoc));
      if (dir == 2) customFilters.push(startAt(lastDoc));
    }

    return Promise.all(
      (
        await this.baseService.getAllFiltered(
          this.collectionName,
          pageSize,
          currentPage,
          customFilters
        )
      ).map(async (snapshot: QueryDocumentSnapshot) => {
        const application = snapshot.data() as Application;

        application.job = (await getDoc(application.job_ref)).data() as Job;
        application.user = (await getDoc(application.user_ref)).data() as User;

        return { doc: snapshot, application: application };
      })
    );
  }

  private createFilters(filters: Record<string, string>) {
    const companyRef = this.baseService.getDocumentRef('Companies', filters['company_id']);
    const jobRef =
      filters['job_id'] == '' ? null : this.baseService.getDocumentRef('Jobs', filters['job_id']);

    return Object.entries(filters)
      .map(([key, value]) => {
        if (key == 'company_id') {
          return where('company_ref', '==', companyRef);
        }
        if (key == 'job_id' && jobRef != null) {
          return where('job_ref', '==', jobRef);
        }
        if (key == 'status' && value != ApplicationStatus.NONE.toString()) {
          return where('status', '==', value);
        }
        if (key == 'allSearch') {
          if (value == '') return null;
          return where('allSearchKeywords', 'array-contains', value);
          //return where(key, '==', value) as QueryFieldFilterConstraint;
        }

        return null;
      })
      .filter(d => d !== null) as (QueryFieldFilterConstraint | QueryStartAtConstraint)[];
  }

  updateApplication(id: string, application: Partial<Application>): Promise<void> {
    return this.baseService.update(this.collectionName, id, application);
  }

  updateApplication$(id: string, application: Partial<Application>) {
    return from(this.updateApplication(id, application));
  }
}

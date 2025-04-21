import { AuthService } from './auth.service';
import { ApplicationService } from './application.service';
import { Job } from './../models/job.model';
import { Company } from './../models/company.model';
import { inject, Injectable } from '@angular/core';
import { FirestoreBaseService } from './firestore-base.service';
import {
  getDoc,
  QueryDocumentSnapshot,
  QueryFieldFilterConstraint,
  QueryStartAtConstraint,
  startAfter,
  startAt,
  Timestamp,
  where,
} from '@angular/fire/firestore';
import { Education } from '../enums/education.enum';
import { JobSearchDate } from '../enums/job-search-date.enum';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private baseService = inject(FirestoreBaseService<Job>);
  private applicationService = inject(ApplicationService);
  private authService = inject(AuthService);
  private collectionName = 'Jobs';

  public create(job: Job): Promise<void> {
    return this.baseService.createWithAutoId(this.collectionName, job);
  }

  public updateJob(jobId: string, jobData: Partial<Job>): Promise<void> {
    return this.baseService.update(this.collectionName, jobId, jobData);
  }

  public async getAll(): Promise<Job[]> {
    return Promise.all(
      (await this.baseService.getAll(this.collectionName)).map(async (job: Job) => {
        job.company = (await getDoc(job.company_ref)).data() as Company;
        return job;
      })
    );
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
  ): Promise<{ doc: QueryDocumentSnapshot; job: Job }[]> {
    //Nincs már full-text search firestoreba :'(
    const customFilters = this.createFilters(filters);

    if (currentPage !== 0) {
      if (dir == 1) customFilters.push(startAfter(lastDoc));
      if (dir == 0) customFilters.push(startAt(lastDoc));
      if (dir == 2) customFilters.push(startAt(lastDoc));
    }

    const userRef = this.baseService.getDocumentRef(
      'Users',
      this.authService.getUserUid() as string
    );
    return Promise.all(
      (
        await this.baseService.getAllFiltered(
          this.collectionName,
          pageSize,
          currentPage,
          customFilters
        )
      ).map(async (snapshot: QueryDocumentSnapshot) => {
        const job = snapshot.data() as Job;
        const jobRef = snapshot.ref;

        job.company = (await getDoc(job.company_ref)).data() as Company;
        job.applied =
          (await this.applicationService.getApplicationByUserAndJob(userRef, jobRef)).length != 0;
        return { doc: snapshot, job: job };
      })
    );
  }

  public getByCompanyRef(companyId: string): Promise<Job[]> {
    const companyRef = this.baseService.getDocumentRef('Companies', companyId);
    return this.baseService.getByField(this.collectionName, 'company_ref', '==', companyRef);
  }

  private createFilters(filters: Record<string, string>) {
    return Object.entries(filters)
      .map(([key, value]) => {
        if (key == 'date') {
          const date = new Date();

          switch (value) {
            case JobSearchDate.LAST_DAY.toString():
              date.setDate(date.getDate() - 1);
              break;
            case JobSearchDate.THREE_DAYS.toString():
              date.setDate(date.getDate() - 3);

              break;
            case JobSearchDate.ONE_WEEK.toString():
              date.setDate(date.getDate() - 7);
              break;
            case JobSearchDate.ONE_MONTH.toString():
              date.setMonth(date.getMonth() - 1);
              break;
            default:
              return null;
          }

          return where(key, '>=', Timestamp.fromDate(date));
        }

        if (key == 'education') {
          if (value == Education.NONE.toString()) return null;
          return where(key, '==', parseInt(value)) as QueryFieldFilterConstraint;
        }

        if (key == 'title') {
          if (value == '') return null;
          return where('titleSearchKeywords', 'array-contains', value);
          //return where(key, '==', value) as QueryFieldFilterConstraint;
        }

        return null;
      })
      .filter(d => d !== null) as (QueryFieldFilterConstraint | QueryStartAtConstraint)[];
  }

  public async deleteJobAndApplications(jobId: string): Promise<void> {
    const jobRef = this.baseService.getDocumentRef(this.collectionName, jobId);

    // Töröljük az applications-t majd a job-ot
    const applications = await this.applicationService.getApplicationsByJob(jobRef);

    for (const application of applications) {
      await this.applicationService.deleteApplicationById(application.id);
    }

    await this.baseService.delete(this.collectionName, jobId);
  }
}

import { Job } from './../models/job.model';
import { Company } from './../models/company.model';
import { inject, Injectable } from '@angular/core';
import { FirestoreBaseService } from './firestore-base.service';
import {
  collection,
  endBefore,
  getCountFromServer,
  getDoc,
  QueryDocumentSnapshot,
  QueryFieldFilterConstraint,
  QueryStartAtConstraint,
  startAfter,
  startAt,
  where,
} from '@angular/fire/firestore';
import { Education } from '../enums/education.enum';
import { JobSearchDate } from '../enums/job-search-date.enum';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private baseService = inject(FirestoreBaseService<Job>);

  private collectionName = 'Jobs';

  public create(job: Job): Promise<void> {
    return this.baseService.create(this.collectionName, job);
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
  public async getAllFiltered(
    pageSize: number,
    currentPage: number,
    filters: string[][], //T[]
    dir: number,
    lastDoc: QueryDocumentSnapshot | null
  ): Promise<{ doc: QueryDocumentSnapshot; job: Job }[]> {
    //Nincs már full-text search firestoreba :'(
    const customFilters = filters
      .map((value, index) => {
        if (value[0] == 'date') return null; //skip ideiglenesen

        if (
          [Education.NONE.toString(), JobSearchDate.NONE.toString(), ''].includes(value[1]) ||
          (JobSearchDate.ALL.toString() == value[1] && index == 1)
        )
          return null;
        if (index < 2)
          return where(value[0], '==', parseInt(value[1])) as QueryFieldFilterConstraint;
        return null; //where('title', '>=', value[1]), where('title', '<=', value[1] + '~');
      })
      .filter(d => d !== null) as (QueryFieldFilterConstraint | QueryStartAtConstraint)[];

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
        const job = snapshot.data() as Job;

        job.company = (await getDoc(job.company_ref)).data() as Company;
        return { doc: snapshot, job: job };
      })
    );
  }

  public getByCompanyId(companyId: string): Promise<Job[]> {
    return this.baseService.getByField(this.collectionName, 'company_id', '==', companyId);
  }
}

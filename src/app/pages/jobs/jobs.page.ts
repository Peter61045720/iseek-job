import { AuthService } from './../../shared/services/auth.service';
import { Application } from './../../shared/models/application.model';
import { JobSearchDate, JobSearchDateDescriptions } from '../../shared/enums/job-search-date.enum';
import { Education, EducationDescriptions } from '../../shared/enums/education.enum';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Job } from '../../shared/models/job.model';
import { JobService } from './../../shared/services/job.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { debounceTime, firstValueFrom, Subject, Subscription } from 'rxjs';
import { QueryDocumentSnapshot, Timestamp } from '@angular/fire/firestore';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ApplicationService } from '../../shared/services/application.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-jobs',
  imports: [
    MatCardModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    DatePipe,
  ],
  templateUrl: './jobs.page.html',
  styleUrl: './jobs.page.scss',
})
export class JobsPage implements OnInit, OnDestroy {
  jobs: Job[] = [];

  private modelChanged: Subject<string> = new Subject<string>();
  private subscription!: Subscription;
  debounceTime = 500;
  docs: QueryDocumentSnapshot[] = [];

  ngOnInit(): void {
    this.subscription = this.modelChanged.pipe(debounceTime(this.debounceTime)).subscribe(() => {
      this.getFilteredData(0);
    });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  pageIndex: number;
  pageSize: number;
  length: number;
  prevPageFirstJob: QueryDocumentSnapshot | null = null;

  educationKeys = Object.keys(EducationDescriptions);
  educationDesc = EducationDescriptions;
  jobKeys = Object.keys(JobSearchDateDescriptions);
  jobDesc = JobSearchDateDescriptions;

  currEducation: Education | string = Education.NONE + '';
  currJobSearchDate: JobSearchDate | string = JobSearchDate.ALL + '';
  search = '';

  constructor(
    private jobService: JobService,
    private applicationService: ApplicationService,
    private authService: AuthService,
    private toast: HotToastService
  ) {
    this.pageIndex = 0;
    this.pageSize = 10;
    this.length = 0;
    /*jobService.getAll().then(async data => {
      this.jobs = data;
    });*/

    //jobService.countAll().then(count => (this.length = count));
    this.getFilteredData(0);
  }
  handlePageEvent(e: PageEvent) {
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    if (e.previousPageIndex && e.previousPageIndex > e.pageIndex) this.getFilteredData(2);
    else this.getFilteredData(1);
  }

  handleEducationChange(value: number) {
    this.pageIndex = 0;
    this.getFilteredData(0);
  }
  handleDateChange(value: number) {
    /**Todo servicebe date feltételek */
    this.pageIndex = 0;
    this.getFilteredData(0);
  }
  /**
   * Nincs már fulltext Search
   * Inkább cég nevekből select, ha már úgyse tudunk pozíció névre keresni...
   */
  handleSearch(e: Event) {
    this.pageIndex = 0;
    this.modelChanged.next(this.search);
  }
  private getFilteredData(dir: number) {
    let doc: QueryDocumentSnapshot | null = this.docs[0] ?? null;
    if (dir == 1) doc = this.docs[this.docs.length - 1] ?? null; //előrefele lépünk startAfter()
    if (dir == 2) doc = this.prevPageFirstJob; //visszafele lépünk endBefore()
    //dir == 0 ==>helyben maradunk startAt()

    const tmp = this.docs[0];

    /*const filters = [
      ['education', this.currEducation as string],
      ['date', this.currJobSearchDate as string],
      ['title', this.search],
    ];
    */
    const filters: Record<string, string> = {
      'education': this.currEducation as string,
      'date': this.currJobSearchDate as string,
      'title': this.search.toLowerCase(),
    };

    this.jobService.getAllFiltered(this.pageSize, this.pageIndex, filters, dir, doc).then(jobs => {
      this.jobs = jobs.map(d => d.job);
      this.docs = jobs.map(d => d.doc);
      this.prevPageFirstJob = tmp;
    });

    if (dir == 0) {
      this.jobService.countAllFiltered(filters).then(count => (this.length = count));
    }
  }

  apply(job_id: string, idx: number) {
    firstValueFrom(
      this.applicationService.createApplication$(this.authService.getUserUid()!, job_id).pipe(
        this.toast.observe({
          loading: 'Applying...',
          success: () => {
            this.jobs[idx].applied = true;
            return 'Successfully applied!';
          },
          error: e => {
            console.error(e);
            const msg = typeof e === 'string' ? ' ' + e : '';
            return 'Applying failed!' + msg;
          },
        })
      )
    );
  }

  withdraw(job_id: string, idx: number) {
    firstValueFrom(
      this.applicationService.withdrawByUserAndJob$(this.authService.getUserUid()!, job_id).pipe(
        this.toast.observe({
          loading: 'Withdrawing...',
          success: () => {
            this.jobs[idx].applied = false;
            return 'Successfully withdrawn!';
          },
          error: e => {
            console.error(e);
            const msg = typeof e === 'string' ? ' ' + e : '';
            return 'Withdrawing failed!' + msg;
          },
        })
      )
    );
  }
}

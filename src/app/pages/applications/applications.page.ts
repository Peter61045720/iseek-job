import { JobService } from './../../shared/services/job.service';
import { ApplicationService } from './../../shared/services/application.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Application } from '../../shared/models/application.model';
import {
  ApplicationStatus,
  ApplicationStatusDescriptions,
} from '../../shared/enums/application-status.enum';
import { debounceTime, Subject, Subscription, firstValueFrom } from 'rxjs';
import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { HotToastService } from '@ngxpert/hot-toast';
import { Job } from '../../shared/models/job.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-applications',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    DatePipe,
  ],
  templateUrl: './applications.page.html',
  styleUrl: './applications.page.scss',
})
export class ApplicationsPage implements OnInit, OnDestroy {
  id: string;

  displayedColumns: string[] = ['name', 'email', 'date', 'job', 'status'];
  dataSource = new MatTableDataSource<Application>();

  applications: Application[] = [];

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

  statuses = ApplicationStatusDescriptions;
  applicationKeys = Object.keys(ApplicationStatusDescriptions);
  applicationStatusEnum = ApplicationStatus;
  pageIndex: number;
  pageSize: number;
  length: number;
  prevPageFirstApplication: QueryDocumentSnapshot | null = null;

  currStatus: ApplicationStatus | string = ApplicationStatus.APPLIED + '';
  search = '';
  emptyJob: Partial<Job> = { id: '' };
  activeJobs: Partial<Job>[] = [];
  currJobId = '';
  currApplicationStatus: ApplicationStatus | string = ApplicationStatus.NONE + '';

  constructor(
    private route: ActivatedRoute,
    private applicationService: ApplicationService,
    private toast: HotToastService,
    private jobService: JobService
  ) {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    this.pageIndex = 0;
    this.pageSize = 10;
    this.length = 0;

    this.jobService.getByCompanyRef(this.id).then(j => {
      this.activeJobs = [this.emptyJob];
      this.activeJobs.push(...j);
    });

    this.getFilteredData(0);
  }

  handlePageEvent(e: PageEvent) {
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    if (e.previousPageIndex && e.previousPageIndex > e.pageIndex) this.getFilteredData(2);
    else this.getFilteredData(1);
  }

  handleSearch(e: Event) {
    this.pageIndex = 0;
    this.modelChanged.next(this.search);
  }

  handleJobSearch($event: MatSelectChange) {
    this.pageIndex = 0;
    this.getFilteredData(0);
  }

  private getFilteredData(dir: number) {
    let doc: QueryDocumentSnapshot | null = this.docs[0] ?? null;
    if (dir == 1) doc = this.docs[this.docs.length - 1] ?? null; //előrefele lépünk startAfter()
    if (dir == 2) doc = this.prevPageFirstApplication; //visszafele lépünk endBefore()
    //dir == 0 ==>helyben maradunk startAt()

    const tmp = this.docs[0];

    const filters: Record<string, string> = {
      'company_id': this.id,
      'job_id': this.currJobId,
      'allSearch': this.search.toLowerCase(),
      'status': this.currApplicationStatus.toString(),
    };

    this.applicationService
      .getAllFiltered(this.pageSize, this.pageIndex, filters, dir, doc)
      .then(applications => {
        this.applications = applications.map(d => d.application);
        this.docs = applications.map(d => d.doc);
        this.prevPageFirstApplication = tmp;

        this.dataSource = new MatTableDataSource(this.applications);
      });

    if (dir == 0) {
      this.applicationService.countAllFiltered(filters).then(count => (this.length = count));
    }
  }

  updateApplication($event: MatSelectChange, application: Application) {
    const oldStatus = application.status;
    application.status = $event.value;

    firstValueFrom(
      this.applicationService.updateApplication$(application.id, { status: $event.value }).pipe(
        this.toast.observe({
          loading: 'Updating Status...',
          success: () => {
            return 'Successfully Updated!';
          },
          error: e => {
            console.error(e);
            const msg = typeof e === 'string' ? ' ' + e : '';
            return 'Updating failed!' + msg;
          },
        })
      )
    )
      .then(_ => (application.status = $event.value))
      .catch(_ => (application.status = oldStatus));

    console.log('UPDATE', $event.value, application);
  }
}

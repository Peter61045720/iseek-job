import { authGuard } from './../../shared/guards/auth.guard';
import { AuthService } from './../../shared/services/auth.service';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  ApplicationStatus,
  ApplicationStatusDescriptions,
} from '../../shared/enums/application-status.enum';
import { firstValueFrom } from 'rxjs';
import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { HotToastService } from '@ngxpert/hot-toast';
import { Job } from '../../shared/models/job.model';
import { DatePipe } from '@angular/common';
import { ApplicationService } from '../../shared/services/application.service';
import { JobService } from '../../shared/services/job.service';
import { Application } from '../../shared/models/application.model';

@Component({
  selector: 'app-my-applications',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    DatePipe,
  ],
  templateUrl: './my-applications.page.html',
  styleUrl: './my-applications.page.scss',
})
export class MyApplicationsPage implements AfterViewInit {
  statuses = ApplicationStatusDescriptions;
  applicationKeys = Object.keys(ApplicationStatusDescriptions);
  applicationStatusEnum = ApplicationStatus;
  currApplicationStatus: ApplicationStatus | string = ApplicationStatus.NONE + '';
  dataSource = new MatTableDataSource<Application>();
  displayedColumns: string[] = ['company_name', 'date', 'job', 'status', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private applicationService: ApplicationService,
    private toast: HotToastService,
    private jobService: JobService,
    private authService: AuthService
  ) {
    this.applicationService.getApplicationsByUser(this.authService.getUserUid()!).then(data => {
      this.dataSource.data = data.map((d: Application) => {
        d.applied = true;
        return d;
      });
    });
    this.dataSource.filterPredicate = (data, filterValue) => {
      return filterValue === '0' || data.status.toString() === filterValue;
    };
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: MatSelectChange) {
    const filterValue = event.value;

    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  withdraw(application_id: string, idx: number) {
    console.log('withdraw', application_id, idx);
    firstValueFrom(
      this.applicationService.deleteApplicationById$(application_id).pipe(
        this.toast.observe({
          loading: 'Withdrawing...',
          success: () => {
            return 'Successfully withdrawn!';
          },
          error: e => {
            console.error(e);
            const msg = typeof e === 'string' ? ' ' + e : '';
            return 'Withdrawing failed!' + msg;
          },
        })
      )
    ).then(_ => (this.dataSource.data[idx].applied = false));
  }
  apply(job_id: string, idx: number) {
    firstValueFrom(
      this.applicationService.createApplication$(this.authService.getUserUid()!, job_id).pipe(
        this.toast.observe({
          loading: 'Applying...',
          success: () => {
            return 'Successfully applied!';
          },
          error: e => {
            console.error(e);
            const msg = typeof e === 'string' ? ' ' + e : '';
            return 'Applying failed!' + msg;
          },
        })
      )
    ).then(application => {
      const oldCompany = this.dataSource.data[idx].company;
      const oldJob = this.dataSource.data[idx].job;

      this.dataSource.data[idx].applied = true;
      this.dataSource.data[idx].date = application.date;
      this.dataSource.data[idx].status = application.status;
      this.dataSource.data[idx].id = application.id;

      application.applied = true;

      this.dataSource.data[idx] = application;
      this.dataSource.data[idx].applied = true;
      this.dataSource.data[idx].company = oldCompany;
      this.dataSource.data[idx].job = oldJob;
    });
  }
}

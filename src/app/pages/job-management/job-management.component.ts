import { AuthService } from './../../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { JobService } from '../../shared/services/job.service';
import { Job } from '../../shared/models/job.model';
import { Contact } from '../../shared/models/contact.model';
import { ContactService } from '../../shared/services/contact.service';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatOption, MatSelect } from '@angular/material/select';
import { JobStatus } from '../../shared/enums/job-status.enum';
import { FirestoreBaseService } from '../../shared/services/firestore-base.service';
import { generateSearchKeywords } from '../../shared/functions/generate-search-keywords.function';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-job-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIcon,
    MatIconButton,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatOption,
    MatSelect,
  ],
  templateUrl: './job-management.component.html',
  styleUrl: './job-management.component.scss',
})
export class JobManagementComponent implements OnInit {
  jobs: Job[] = [];
  isLoading = true;
  contact: Contact | null = null;
  jobForm!: FormGroup;
  showAddJobForm = false;

  constructor(
    private jobService: JobService,
    private authService: AuthService,
    private contactService: ContactService,
    private fb: FormBuilder,
    private firestoreBaseService: FirestoreBaseService<Job>
  ) {
    // Form inicializálás
    this.jobForm = this.fb.group({
      position: ['', Validators.required],
      work_location: ['', Validators.required],
      type: ['', Validators.required],
      testing_time: ['', Validators.required],
      status: [JobStatus.ACTIVE, Validators.required],
      education: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  async ngOnInit(): Promise<void> {
    try {
      const uid = this.authService.getUserUid();
      this.contact = await this.contactService.getContactById(uid!);

      if (!this.contact?.companyId) {
        console.error('A bejelentkezett HR-nek nincs cég azonosítója!');
        return;
      }

      this.jobs = await this.jobService.getByCompanyRef(this.contact.companyId);
    } catch (error) {
      console.error('Hiba a job-amangement oldalt betöltése közben: ', error);
    } finally {
      this.isLoading = false;
    }
  }

  async deleteJob(jobId: string) {
    const confirmDelete = confirm('Biztosan törölni szeretnéd ezt az állást?');
    if (!confirmDelete) return;

    try {
      await this.jobService.deleteJobAndApplications(jobId);
      this.jobs = this.jobs.filter(job => job.id !== jobId);
    } catch (error) {
      console.error('Hiba állás törlése közben: ', error);
    }
  }

  async createJob() {
    if (!this.jobForm.valid || !this.contact?.companyId) return;

    const formValue = this.jobForm.value;

    const companyRef = this.firestoreBaseService.getDocumentRef(
      'Companies',
      this.contact.companyId
    );

    const newJob: Job = {
      id: '',
      company_ref: companyRef,
      date: Timestamp.now(),
      description: formValue.description,
      education: formValue.education,
      position: formValue.position,
      testing_time: formValue.testing_time,
      type: formValue.type,
      work_location: formValue.work_location,
      status: formValue.status,
      titleSearchKeywords: generateSearchKeywords(formValue.position),
    };
    try {
      await this.jobService.create(newJob);
      this.jobs = await this.jobService.getByCompanyRef(this.contact.companyId);
      this.jobForm.reset();
      this.toggleAddJobForm();
    } catch (error) {
      console.error('Hiba az állás létrehozásakor: ', error);
    }
  }

  toggleAddJobForm(): void {
    this.showAddJobForm = !this.showAddJobForm;
  }
}

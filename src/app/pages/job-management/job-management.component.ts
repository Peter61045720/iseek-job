import { AuthService } from './../../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { JobService } from '../../shared/services/job.service';
import { Job } from '../../shared/models/job.model';
import { Contact } from '../../shared/models/contact.model';
import { ContactService } from '../../shared/services/contact.service';

@Component({
  selector: 'app-job-management',
  imports: [CommonModule],
  templateUrl: './job-management.component.html',
  styleUrl: './job-management.component.scss',
})
export class JobManagementComponent implements OnInit {
  jobs: Job[] = [];
  isLoading = true;
  contact: Contact | null = null;

  constructor(
    private jobService: JobService,
    private authService: AuthService,
    private contactService: ContactService
  ) {}

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
}

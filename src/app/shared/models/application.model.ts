import { DocumentReference, Timestamp } from '@angular/fire/firestore';
import { Job } from './job.model';
import { User } from './user.model';
import { ApplicationStatus } from '../enums/application-status.enum';
import { Company } from './company.model';

export interface Application {
  id: string;
  date: Timestamp;

  job_ref: DocumentReference;
  job?: Job;

  user_ref: DocumentReference;
  user?: User;

  company_ref: DocumentReference;
  company?: Company;

  status: ApplicationStatus;
  allSearchKeywords?: string[];
}

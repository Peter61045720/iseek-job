import { DocumentReference, Timestamp } from '@angular/fire/firestore';
import { Job } from './job.model';
import { User } from './user.model';

export interface Application {
  id: string;
  date: Timestamp;

  job_ref: DocumentReference;
  job?: Job;

  user_ref: DocumentReference;
  user?: User;

  status: number;
}

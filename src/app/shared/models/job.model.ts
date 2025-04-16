import { DocumentReference, Timestamp } from '@angular/fire/firestore';
import { Company } from './company.model';

export interface Job {
  id: string;
  company_ref: DocumentReference;
  company?: Company;
  date: Timestamp;
  description: string;
  education: string;
  position: string;
  testing_time: string; //trial_period?
  type: string;
  work_location: string;

  applied?: boolean;
  titleSearchKeywords?: string[];
}

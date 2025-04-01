import { inject, Injectable } from '@angular/core';
import { FirestoreBaseService } from './firestore-base.service';
import { Company } from './../models/company.model';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private baseService = inject(FirestoreBaseService);

  private collectionName = 'Companies';

  createCompany(company: Partial<Company>): Promise<Company> {
    return this.baseService.createWithAutoId(this.collectionName, company);
  }

  getCompanyById(id: string): Promise<Company | null> {
    return this.baseService.getById(this.collectionName, id);
  }
}

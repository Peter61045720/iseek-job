import { inject, Injectable } from '@angular/core';
import { FirestoreBaseService } from './firestore-base.service';
import { Company } from './../models/company.model';
import { from, Observable } from 'rxjs';

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

  updateCompany(id: string, company: Partial<Company>): Promise<void> {
    return this.baseService.update(this.collectionName, id, company);
  }

  updateCompany$(id: string, company: Partial<Company>): Observable<void> {
    return from(this.updateCompany(id, company));
  }
}

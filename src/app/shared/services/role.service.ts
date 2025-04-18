import { inject, Injectable } from '@angular/core';
import { FirestoreBaseService } from './firestore-base.service';
import { Role } from '../models/role.model';
import { from, map, Observable } from 'rxjs';
import { UserRole } from '../enums/user-role.enum';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private baseService = inject(FirestoreBaseService);

  private collectionName = 'Roles';

  createRole(role: Role): Promise<void> {
    return this.baseService.createWithId(this.collectionName, role);
  }

  getRole(id: string): Promise<Role> {
    return this.baseService.getById(this.collectionName, id);
  }

  getRole$(id: string): Observable<UserRole> {
    return from(this.getRole(id)).pipe(map(role => role.role));
  }

  updateRole(id: string, role: Partial<Role>): Promise<void> {
    return this.baseService.update(this.collectionName, id, role);
  }

  deleteRole(id: string): Promise<void> {
    return this.baseService.delete(this.collectionName, id);
  }
}

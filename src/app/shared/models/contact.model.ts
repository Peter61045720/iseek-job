import { UserRole } from '../enums/user-role.enum';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  companyId: string;
}

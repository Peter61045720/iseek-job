import { UserRole } from './../enums/user-role.enum';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  residence: string;
  role: UserRole;
}

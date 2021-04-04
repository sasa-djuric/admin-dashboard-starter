import { User } from '@app/services/users';

export interface TableRow extends User {
  key: string | number;
  status: 'Active' | 'Inactive';
}

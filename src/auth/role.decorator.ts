import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../users/entities/user.entity';

export type Allowed = UserRole[] | 'Any';

export const Role = (roles: Allowed) => SetMetadata('roles', roles);

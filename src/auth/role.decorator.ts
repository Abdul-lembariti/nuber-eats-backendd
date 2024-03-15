// In role.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../users/entities/user.entity';

export type Allowed = keyof typeof UserRole | 'Any';

export const Role = (roles: Allowed[]) => SetMetadata('roles', roles);

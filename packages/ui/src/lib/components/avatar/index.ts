export * from './avatar.types';
export * from './avatar.component';
export * from './avatar-image.directive';
export * from './avatar-fallback.component';
export * from './avatar-badge.directive';
export * from './avatar-group.component';
export * from './avatar-group-count.component';

import { AvatarBadgeDirective } from './avatar-badge.directive';
import { AvatarFallbackComponent } from './avatar-fallback.component';
import { AvatarGroupCountComponent } from './avatar-group-count.component';
import { AvatarGroupComponent } from './avatar-group.component';
import { AvatarImageDirective } from './avatar-image.directive';
import { AvatarComponent } from './avatar.component';

export const SANRING_AVATAR_IMPORTS = [
  AvatarComponent,
  AvatarImageDirective,
  AvatarFallbackComponent,
  AvatarBadgeDirective,
  AvatarGroupComponent,
  AvatarGroupCountComponent,
];

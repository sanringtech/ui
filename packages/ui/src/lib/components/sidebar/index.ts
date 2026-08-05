export * from './sidebar.component';
export * from './sidebar-content.component';
export * from './sidebar-footer.component';
export * from './sidebar-group.component';
export * from './sidebar-group-label.component';
export * from './sidebar-header.component';
export * from './sidebar-menu.component';
export * from './sidebar-menu-button.directive';
export * from './sidebar-menu-item.component';
export * from './sidebar-trigger.directive';
export * from './sidebar.type';

import { SidebarContentComponent } from './sidebar-content.component';
import { SidebarFooterComponent } from './sidebar-footer.component';
import { SidebarGroupLabelComponent } from './sidebar-group-label.component';
import { SidebarGroupComponent } from './sidebar-group.component';
import { SidebarHeaderComponent } from './sidebar-header.component';
import { SidebarMenuButtonDirective } from './sidebar-menu-button.directive';
import { SidebarMenuItemComponent } from './sidebar-menu-item.component';
import { SidebarMenuComponent } from './sidebar-menu.component';
import { SidebarTriggerDirective } from './sidebar-trigger.directive';
import { SidebarComponent } from './sidebar.component';

export const SANRING_SIDEBAR_IMPORTS = [
  SidebarComponent,
  SidebarHeaderComponent,
  SidebarContentComponent,
  SidebarFooterComponent,
  SidebarGroupComponent,
  SidebarGroupLabelComponent,
  SidebarMenuComponent,
  SidebarMenuItemComponent,
  SidebarMenuButtonDirective,
  SidebarTriggerDirective,
];

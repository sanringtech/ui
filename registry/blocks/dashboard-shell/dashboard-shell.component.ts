import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  LucideLayoutDashboard,
  LucideLogOut,
  LucidePanelLeft,
  LucideSettings,
  LucideUsers,
} from '@lucide/angular';
import { SANRING_AVATAR_IMPORTS } from '../avatar';
import { BadgeDirective } from '../badge';
import { SANRING_BREADCRUMB_IMPORTS } from '../breadcrumb';
import { SANRING_DROPDOWN_MENU_IMPORTS } from '../dropdown-menu';
import { SANRING_SIDEBAR_IMPORTS } from '../sidebar';

export interface DashboardShellNavItem {
  label: string;
  href?: string;
  badge?: string;
}

@Component({
  selector: 'sanring-dashboard-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LucideLayoutDashboard,
    LucideLogOut,
    LucidePanelLeft,
    LucideSettings,
    LucideUsers,
    SANRING_AVATAR_IMPORTS,
    BadgeDirective,
    SANRING_BREADCRUMB_IMPORTS,
    SANRING_DROPDOWN_MENU_IMPORTS,
    SANRING_SIDEBAR_IMPORTS,
  ],
  template: `
    <div class="flex min-h-svh w-full">
      <sanring-sidebar-provider collapsible="icon">
        <sanring-sidebar>
          <sanring-sidebar-header>
            <div class="flex items-center gap-3 p-2">
              <div
                class="flex size-9 shrink-0 items-center justify-center rounded-[var(--sanring-radius)] bg-[var(--sanring-foreground)] text-[var(--sanring-background)]"
              >
                <svg lucideLayoutDashboard class="size-5"></svg>
              </div>
              <div class="min-w-0">
                <div class="truncate text-sm font-semibold">{{ brand() }}</div>
                <div class="truncate text-xs text-[var(--sanring-muted)]">{{ brandHint() }}</div>
              </div>
            </div>
          </sanring-sidebar-header>

          <sanring-sidebar-content>
            <sanring-sidebar-group>
              <sanring-sidebar-group-label>Workspace</sanring-sidebar-group-label>
              <sanring-sidebar-group-content>
                <sanring-sidebar-menu>
                  @for (item of navItems(); track item.label) {
                    <sanring-sidebar-menu-item>
                      <a
                        sanringSidebarMenuButton
                        [attr.href]="item.href ?? '#'"
                        [active]="item.label === activeNav()"
                      >
                        @switch (item.label) {
                          @case ('Customers') {
                            <svg lucideUsers class="size-4 shrink-0"></svg>
                          }
                          @case ('Settings') {
                            <svg lucideSettings class="size-4 shrink-0"></svg>
                          }
                          @default {
                            <svg lucideLayoutDashboard class="size-4 shrink-0"></svg>
                          }
                        }
                        <span class="truncate">{{ item.label }}</span>
                        @if (item.badge) {
                          <sanring-sidebar-menu-badge>{{ item.badge }}</sanring-sidebar-menu-badge>
                        }
                      </a>
                    </sanring-sidebar-menu-item>
                  }
                </sanring-sidebar-menu>
              </sanring-sidebar-group-content>
            </sanring-sidebar-group>
          </sanring-sidebar-content>

          <sanring-sidebar-footer>
            <sanring-dropdown-menu>
              <button
                type="button"
                sanringDropdownMenuTrigger
                [menu]="userMenu.menu"
                class="flex w-full items-center gap-3 rounded-[var(--sanring-radius)] p-2 hover:bg-[var(--sanring-surface-strong)]"
              >
                <sanring-avatar size="sm" [ariaLabel]="userName()">
                  <sanring-avatar-fallback>{{ userInitials() }}</sanring-avatar-fallback>
                </sanring-avatar>
                <div class="min-w-0 text-left">
                  <div class="truncate text-sm font-medium">{{ userName() }}</div>
                  <div class="truncate text-xs text-[var(--sanring-muted)]">{{ userEmail() }}</div>
                </div>
              </button>
              <sanring-dropdown-menu-content #userMenu="sanringDropdownMenuContent" class="w-56">
                <sanring-dropdown-menu-label>{{ userEmail() }}</sanring-dropdown-menu-label>
                <sanring-dropdown-menu-separator />
                <button type="button" sanringDropdownMenuItem value="settings">
                  <svg lucideSettings class="size-4"></svg>
                  <span>Settings</span>
                </button>
                <button type="button" sanringDropdownMenuItem value="logout">
                  <svg lucideLogOut class="size-4"></svg>
                  <span>Log out</span>
                </button>
              </sanring-dropdown-menu-content>
            </sanring-dropdown-menu>
          </sanring-sidebar-footer>
        </sanring-sidebar>

        <div sanringSidebarInset class="flex min-h-svh flex-col bg-[var(--sanring-background)]">
          <header
            class="flex h-14 items-center gap-3 border-b border-[var(--sanring-border)] px-4"
          >
            <button
              type="button"
              sanringSidebarTrigger
              class="flex size-9 items-center justify-center rounded-[var(--sanring-radius)] hover:bg-[var(--sanring-surface-strong)]"
              aria-label="Toggle sidebar"
            >
              <svg lucidePanelLeft class="size-5"></svg>
            </button>
            <sanring-breadcrumb>
              <sanring-breadcrumb-list>
                @for (crumb of breadcrumbs(); track crumb; let last = $last) {
                  <sanring-breadcrumb-item>
                    @if (last) {
                      <sanring-breadcrumb-page>{{ crumb }}</sanring-breadcrumb-page>
                    } @else {
                      <sanring-breadcrumb-link routerLink="/">{{ crumb }}</sanring-breadcrumb-link>
                    }
                  </sanring-breadcrumb-item>
                  @if (!last) {
                    <sanring-breadcrumb-divider />
                  }
                }
              </sanring-breadcrumb-list>
            </sanring-breadcrumb>
            <span sanringBadge variant="secondary" class="ml-auto">Live</span>
          </header>
          <div class="flex-1 p-6">
            <ng-content />
          </div>
        </div>
      </sanring-sidebar-provider>
    </div>
  `,
})
export class DashboardShellComponent {
  readonly brand = input('Acme Inc');
  readonly brandHint = input('Workspace');
  readonly userName = input('Ada Lovelace');
  readonly userEmail = input('ada@acme.dev');
  readonly userInitials = input('AL');
  readonly activeNav = input('Overview');
  readonly breadcrumbs = input<string[]>(['Workspace', 'Overview']);
  readonly navItems = input<DashboardShellNavItem[]>([
    { label: 'Overview', href: '#' },
    { label: 'Customers', href: '#', badge: '12' },
    { label: 'Settings', href: '#' },
  ]);
}

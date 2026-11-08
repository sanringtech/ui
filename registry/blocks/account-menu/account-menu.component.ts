import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import {
  LucideCheck,
  LucideKeyRound,
  LucideLayoutGrid,
  LucideLogOut,
  LucideMoon,
  LucideSettings,
  LucideSun,
  LucideUserRound,
} from '@lucide/angular';
import { SANRING_AVATAR_IMPORTS } from '../avatar';
import { SANRING_DROPDOWN_MENU_IMPORTS } from '../dropdown-menu';

/** The signed-in person shown at the right of the top bar. */
export interface AccountMenuUser {
  name: string;
  email?: string | null;
  avatarUrl?: string | null;
}

export interface AccountMenuLanguage {
  code: string;
  label: string;
}

/** Menu labels. Defaults are Traditional Chinese; pass translated labels for other languages. */
export interface AccountMenuLabels {
  menu: string;
  personalSettings: string;
  accountSecurity: string;
  mySystems: string;
  language: string;
  themeDark: string;
  themeLight: string;
  logout: string;
}

export const ACCOUNT_MENU_LABELS_ZH_HANT: AccountMenuLabels = {
  menu: '使用者選單',
  personalSettings: '個人設定',
  accountSecurity: '帳號安全',
  mySystems: '我的系統',
  language: '語言',
  themeDark: '切換為深色',
  themeLight: '切換為淺色',
  logout: '登出',
};

export const ACCOUNT_MENU_LABELS_EN: AccountMenuLabels = {
  menu: 'User menu',
  personalSettings: 'Personal settings',
  accountSecurity: 'Account security',
  mySystems: 'My systems',
  language: 'Language',
  themeDark: 'Switch to dark',
  themeLight: 'Switch to light',
  logout: 'Sign out',
};

/**
 * Sanring family account menu (sanring-sso docs/rp-integration.md §4-1): name and email, avatar, and a menu with
 * personal settings, account security, my systems (all in the SSO account center), language, theme, and sign out.
 *
 * Presentational only: the host app supplies the user and account-center URL and handles `logout`,
 * `themeToggle` and `languageChange`. Account items open in a new tab, except inside the account center itself
 * (`accountCenterInApp`). Without `accountCenterUrl` (e.g. local dev login) the account items and sign out are hidden.
 */
@Component({
  selector: 'sanring-account-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SANRING_AVATAR_IMPORTS,
    SANRING_DROPDOWN_MENU_IMPORTS,
    LucideCheck,
    LucideKeyRound,
    LucideLayoutGrid,
    LucideLogOut,
    LucideMoon,
    LucideSettings,
    LucideSun,
    LucideUserRound,
  ],
  host: { class: 'flex min-w-0 items-center gap-3' },
  template: `
    @if (user(); as u) {
      <div class="hidden min-w-0 flex-col items-end text-right sm:flex" data-testid="account-name">
        <span class="max-w-48 truncate text-sm font-medium text-[var(--sanring-foreground)]">{{ u.name }}</span>
        @if (u.email && u.email !== u.name) {
          <span class="max-w-48 truncate text-xs text-[var(--sanring-muted)]">{{ u.email }}</span>
        }
      </div>
    }
    <sanring-dropdown-menu>
      <button type="button" sanringDropdownMenuTrigger [menu]="accountMenu.menu" side="bottom" align="end"
              class="cursor-pointer rounded-full" [attr.aria-label]="labels().menu" data-testid="account-menu">
        <sanring-avatar size="md">
          @if (user()?.avatarUrl; as src) {
            <img sanringAvatarImage [src]="src" alt="" />
          }
          <sanring-avatar-fallback>
            @if (initials(); as text) {
              {{ text }}
            } @else {
              <svg lucideUserRound class="size-4"></svg>
            }
          </sanring-avatar-fallback>
        </sanring-avatar>
      </button>
      <sanring-dropdown-menu-content #accountMenu="sanringDropdownMenuContent" class="min-w-56 rounded-[var(--sanring-radius)] p-2"
                                     (itemSelected)="onSelect($event)">
        @if (accountCenterUrl()) {
          <button type="button" sanringDropdownMenuItem value="account:profile" class="cursor-pointer px-3" data-testid="account-profile">
            <svg lucideSettings class="size-4"></svg>{{ labels().personalSettings }}
          </button>
          <button type="button" sanringDropdownMenuItem value="account:security" class="cursor-pointer px-3" data-testid="account-security">
            <svg lucideKeyRound class="size-4"></svg>{{ labels().accountSecurity }}
          </button>
          <button type="button" sanringDropdownMenuItem value="account:systems" class="cursor-pointer px-3" data-testid="account-systems">
            <svg lucideLayoutGrid class="size-4"></svg>{{ labels().mySystems }}
          </button>
          <sanring-dropdown-menu-separator />
        }
        @if (languages().length > 1) {
          <sanring-dropdown-menu-label class="px-3">{{ labels().language }}</sanring-dropdown-menu-label>
          @for (lang of languages(); track lang.code) {
            <button type="button" sanringDropdownMenuItem [value]="'lang:' + lang.code" class="cursor-pointer px-3">
              <span class="flex size-4 shrink-0 items-center justify-center text-[var(--sanring-primary-50)]">
                @if (lang.code === activeLanguage()) {
                  <svg lucideCheck class="size-4"></svg>
                }
              </span>
              {{ lang.label }}
            </button>
          }
          <sanring-dropdown-menu-separator />
        }
        <button type="button" sanringDropdownMenuItem value="theme" class="cursor-pointer px-3" data-testid="account-theme">
          @if (isDark()) {
            <svg lucideSun class="size-4"></svg>{{ labels().themeLight }}
          } @else {
            <svg lucideMoon class="size-4"></svg>{{ labels().themeDark }}
          }
        </button>
        @if (accountCenterUrl()) {
          <sanring-dropdown-menu-separator />
          <button type="button" sanringDropdownMenuItem variant="destructive" value="logout" class="cursor-pointer px-3"
                  style="color: var(--sanring-error-50)" data-testid="account-logout">
            <svg lucideLogOut class="size-4"></svg>{{ labels().logout }}
          </button>
        }
      </sanring-dropdown-menu-content>
    </sanring-dropdown-menu>
  `,
})
export class AccountMenuComponent {
  readonly user = input<AccountMenuUser | null>(null);
  /** SSO account center, e.g. https://auth.sanring.com/ . Null hides the account items and sign out. */
  readonly accountCenterUrl = input<string | null>(null);
  /** True inside the account center itself: account items navigate in the same tab. */
  readonly accountCenterInApp = input(false);
  readonly languages = input<readonly AccountMenuLanguage[]>([]);
  readonly activeLanguage = input<string | null>(null);
  readonly isDark = input(false);
  readonly labels = input<AccountMenuLabels>(ACCOUNT_MENU_LABELS_ZH_HANT);

  readonly logout = output<void>();
  readonly themeToggle = output<void>();
  readonly languageChange = output<string>();

  /** First character of the name; Latin names use the first two letters, upper-cased. */
  protected readonly initials = computed(() => {
    const name = this.user()?.name?.trim() ?? '';
    if (!name) return '';
    return /^[A-Za-z]/.test(name) ? name.slice(0, 2).toUpperCase() : name[0];
  });

  protected onSelect(value: unknown): void {
    if (value === 'theme') {
      this.themeToggle.emit();
    } else if (value === 'logout') {
      this.logout.emit();
    } else if (typeof value === 'string' && value.startsWith('lang:')) {
      this.languageChange.emit(value.slice('lang:'.length));
    } else if (typeof value === 'string' && value.startsWith('account:')) {
      const url = this.accountUrl(value.slice('account:'.length));
      if (!url) return;
      if (this.accountCenterInApp()) window.location.assign(url);
      else window.open(url, '_blank', 'noopener');
    }
  }

  /** profile → {center}/profile, security → {center}/security, systems → {center}/ */
  protected accountUrl(section: string): string | null {
    const base = this.accountCenterUrl();
    if (!base) return null;
    const root = base.endsWith('/') ? base : `${base}/`;
    return section === 'systems' ? root : `${root}${section}`;
  }
}

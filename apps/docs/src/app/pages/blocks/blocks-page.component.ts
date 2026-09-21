import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideLayoutDashboard, LucidePanelLeft } from '@lucide/angular';
import {
  ButtonDirective,
  DescriptionDirective,
  FieldLabelDirective,
  InputDirective,
  LinkDirective,
  SANRING_ALERT_IMPORTS,
  SANRING_CARD_IMPORTS,
  SANRING_SIDEBAR_IMPORTS,
  SanringFieldComponent,
} from '@sanring/ui';
import { ComponentPageSectionDefinition } from '../../docs-schema/component-page.types';
import { I18nService } from '../../i18n/i18n.service';
import { SeoService } from '../../seo/seo.service';
import {
  ComponentPageCodeBlock,
  ComponentPageCodePreviewer,
  ComponentPageComponent,
  ComponentPageSectionComponent,
  DocsPageHeaderComponent,
} from '../../layouts/component-page';

@Component({
  selector: 'app-blocks-page',
  imports: [
    FormsModule,
    LucideLayoutDashboard,
    LucidePanelLeft,
    ButtonDirective,
    DescriptionDirective,
    FieldLabelDirective,
    InputDirective,
    LinkDirective,
    SANRING_ALERT_IMPORTS,
    SANRING_CARD_IMPORTS,
    SANRING_SIDEBAR_IMPORTS,
    SanringFieldComponent,
    ComponentPageCodeBlock,
    ComponentPageCodePreviewer,
    ComponentPageComponent,
    ComponentPageSectionComponent,
    DocsPageHeaderComponent,
  ],
  template: `
    <app-component-page [sections]="sections">
      <app-docs-page-header
        [title]="i18n.t('sidebar.blocks')"
        [description]="i18n.t('blocks.page.description')"
        eyebrow="docs / blocks"
      />

      <app-component-page-section [section]="sections[0]">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('blocks.overview.body') }}
        </p>
        <app-component-page-code-block class="mt-6" [code]="installAll" language="bash" />
      </app-component-page-section>

      <app-component-page-section [section]="sections[1]">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('blocks.dashboard.body') }}
        </p>
        <app-component-page-code-block class="mt-6" [code]="installDashboard" language="bash" />
        <app-component-page-code-previewer
          class="mt-6"
          [code]="dashboardSnippet"
          language="angular-html"
          [wide]="true"
        >
          <div
            previewer
            class="h-[360px] w-full overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]"
          >
            <div class="flex h-full w-full">
              <sanring-sidebar-provider collapsible="none">
                <sanring-sidebar>
                  <sanring-sidebar-header>
                    <div class="flex items-center gap-3 p-2">
                      <div
                        class="flex size-9 items-center justify-center rounded-[var(--sanring-radius)] bg-[var(--sanring-foreground)] text-[var(--sanring-background)]"
                      >
                        <svg lucideLayoutDashboard class="size-5"></svg>
                      </div>
                      <div class="text-sm font-semibold">Acme Inc</div>
                    </div>
                  </sanring-sidebar-header>
                  <sanring-sidebar-content>
                    <sanring-sidebar-menu>
                      <sanring-sidebar-menu-item>
                        <a sanringSidebarMenuButton href="#" active>Overview</a>
                      </sanring-sidebar-menu-item>
                      <sanring-sidebar-menu-item>
                        <a sanringSidebarMenuButton href="#">Customers</a>
                      </sanring-sidebar-menu-item>
                    </sanring-sidebar-menu>
                  </sanring-sidebar-content>
                </sanring-sidebar>
                <div sanringSidebarInset class="flex flex-col bg-[var(--docs-surface)] p-4">
                  <button
                    type="button"
                    sanringSidebarTrigger
                    class="mb-4 flex size-9 items-center justify-center rounded-[var(--sanring-radius)]"
                    aria-label="Toggle sidebar"
                  >
                    <svg lucidePanelLeft class="size-5"></svg>
                  </button>
                  <p class="text-sm text-[var(--docs-muted)]">Page content goes here.</p>
                </div>
              </sanring-sidebar-provider>
            </div>
          </div>
        </app-component-page-code-previewer>
      </app-component-page-section>

      <app-component-page-section [section]="sections[2]">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('blocks.login.body') }}
        </p>
        <app-component-page-code-block class="mt-6" [code]="installLogin" language="bash" />
        <app-component-page-code-previewer class="mt-6" [code]="loginSnippet" language="angular-html">
          <div previewer class="flex w-full justify-center bg-[var(--docs-surface)] p-6">
            <sanring-card class="w-full max-w-md">
              <sanring-card-header>
                <h2 sanringCardTitle class="text-xl font-semibold">Sign in</h2>
                <p sanringCardDescription class="text-sm text-[var(--docs-muted)]">
                  Enter your email and password to continue.
                </p>
              </sanring-card-header>
              <sanring-card-content>
                @if (loginError()) {
                  <sanring-alert variant="destructive" class="mb-4">
                    <div sanringAlertTitle>Could not sign in</div>
                    <p sanringAlertDescription>{{ loginError() }}</p>
                  </sanring-alert>
                }
                <form class="grid gap-4" (ngSubmit)="submitLogin()">
                  <sanring-field>
                    <!-- eslint-disable-next-line @angular-eslint/template/label-has-associated-control -->
                    <label sanringLabel>Email</label>
                    <input
                      sanringInput
                      type="email"
                      name="email"
                      [(ngModel)]="email"
                      placeholder="you@company.com"
                    />
                    <p sanringDescription>Use the email on your workspace invite.</p>
                  </sanring-field>
                  <button sanringBtn type="submit" class="w-full">Sign in</button>
                </form>
                <p class="mt-4 text-center text-sm text-[var(--docs-muted)]">
                  No account yet?
                  <a sanringLink href="#">Create one</a>
                </p>
              </sanring-card-content>
            </sanring-card>
          </div>
        </app-component-page-code-previewer>
      </app-component-page-section>

      <app-component-page-section [section]="sections[3]">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('blocks.table.body') }}
        </p>
        <app-component-page-code-block class="mt-6" [code]="installTable" language="bash" />
      </app-component-page-section>
    </app-component-page>
  `,
})
export class BlocksPageComponent {
  protected readonly i18n = inject(I18nService);
  private readonly seo = inject(SeoService);
  protected email = '';
  protected readonly loginError = signal<string | null>(null);

  constructor() {
    effect(() => {
      this.seo.setPage({
        title: this.i18n.t('sidebar.blocks'),
        description: this.i18n.t('blocks.page.description'),
      });
    });
  }

  protected readonly sections: readonly ComponentPageSectionDefinition[] = [
    { id: 'overview', titleKey: 'blocks.overview.title' },
    { id: 'dashboard-shell', titleKey: 'blocks.dashboard.title' },
    { id: 'login', titleKey: 'blocks.login.title' },
    { id: 'table-page', titleKey: 'blocks.table.title' },
  ];

  protected readonly installAll = `npx @sanring/cli add block/dashboard-shell
npx @sanring/cli add block/login
npx @sanring/cli add block/table-page`;
  protected readonly installDashboard = `npx @sanring/cli add block/dashboard-shell`;
  protected readonly installLogin = `npx @sanring/cli add block/login`;
  protected readonly installTable = `npx @sanring/cli add block/table-page`;
  protected readonly dashboardSnippet = `<sanring-dashboard-shell>
  <router-outlet />
</sanring-dashboard-shell>`;
  protected readonly loginSnippet = `<sanring-login />`;

  protected submitLogin(): void {
    this.loginError.set(this.email.includes('@') ? null : 'Enter a valid email to continue.');
  }
}

import { Component, inject } from '@angular/core';
import { LucideActivity, LucideKey, LucideSettings } from '@lucide/angular';
import {
  TabsComponent,
  TabsContentComponent,
  TabsListComponent,
  TabsTriggerComponent,
} from '@sanring/ui';
import { getComponentPageSection } from '../../../docs-schema/component-page.utils';
import { I18nService } from '../../../i18n/i18n.service';
import {
  ComponentPageApiTableComponent,
  ComponentPageCodeBlock,
  ComponentPageCodePreviewer,
  ComponentPageComponent,
  ComponentPageHeaderComponent,
  ComponentPageSectionComponent,
} from '../../../layouts/component-page';
import { tabsPage, tabsPageExamples } from './tabs.docs';

@Component({
  selector: 'app-tabs-page',
  imports: [
    ComponentPageApiTableComponent,
    TabsComponent,
    TabsContentComponent,
    TabsListComponent,
    TabsTriggerComponent,
    ComponentPageCodeBlock,
    ComponentPageCodePreviewer,
    ComponentPageComponent,
    ComponentPageHeaderComponent,
    ComponentPageSectionComponent,
    LucideActivity,
    LucideKey,
    LucideSettings,
  ],
  template: `
    <app-component-page [sections]="page.sections">
      <app-component-page-header
        [componentId]="page.componentId"
        [title]="i18n.t(page.titleKey)"
        [description]="i18n.t(page.descriptionKey)"
      />

      <app-component-page-section [section]="section('basic')">
        <app-component-page-code-previewer [code]="examples.basic" language="angular-html">
          <div previewer class="w-[min(520px,100%)]">
            <sanring-tabs defaultValue="account">
              <sanring-tabs-list>
                <sanring-tabs-trigger value="account">
                  {{ i18n.t('tabs.demo.account') }}
                </sanring-tabs-trigger>
                <sanring-tabs-trigger value="password">
                  {{ i18n.t('tabs.demo.password') }}
                </sanring-tabs-trigger>
              </sanring-tabs-list>

              <sanring-tabs-content value="account">
                <div class="rounded-lg border border-[var(--docs-border)] p-4">
                  <h3 class="m-0 text-sm font-semibold text-[var(--docs-fg)]">
                    {{ i18n.t('tabs.demo.account') }}
                  </h3>
                  <p class="mb-0 mt-2 text-sm leading-6 text-[var(--docs-muted)]">
                    Manage profile, billing, and team identity settings.
                  </p>
                </div>
              </sanring-tabs-content>
              <sanring-tabs-content value="password">
                <div class="rounded-lg border border-[var(--docs-border)] p-4">
                  <h3 class="m-0 text-sm font-semibold text-[var(--docs-fg)]">
                    {{ i18n.t('tabs.demo.password') }}
                  </h3>
                  <p class="mb-0 mt-2 text-sm leading-6 text-[var(--docs-muted)]">
                    Update password requirements and recovery methods.
                  </p>
                </div>
              </sanring-tabs-content>
            </sanring-tabs>
          </div>
        </app-component-page-code-previewer>
      </app-component-page-section>

      <app-component-page-section [section]="section('usage')">
        <div class="grid gap-6">
          <div class="overflow-hidden rounded-lg border border-[var(--docs-border)]">
            <app-component-page-code-block [code]="examples.usageImport" language="typescript" />
          </div>
          <div class="overflow-hidden rounded-lg border border-[var(--docs-border)]">
            <app-component-page-code-block [code]="examples.usageMain" language="angular-html" />
          </div>
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="section('installation')" />

      <app-component-page-section [section]="section('composition')">
        <div class="overflow-hidden rounded-lg border border-[var(--docs-border)]">
          <app-component-page-code-block [code]="examples.composition" language="bash" />
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="section('example')">
        <div class="grid gap-2">
          <app-component-page-section [section]="section('example-horizontal')">
            <app-component-page-code-previewer [code]="examples.horizontal" language="angular-html">
              <div previewer class="w-[min(560px,100%)]">
                <sanring-tabs defaultValue="overview">
                  <sanring-tabs-list>
                    <sanring-tabs-trigger value="overview">
                      {{ i18n.t('tabs.demo.overview') }}
                    </sanring-tabs-trigger>
                    <sanring-tabs-trigger value="analytics">
                      {{ i18n.t('tabs.demo.analytics') }}
                    </sanring-tabs-trigger>
                    <sanring-tabs-trigger value="reports">
                      {{ i18n.t('tabs.demo.reports') }}
                    </sanring-tabs-trigger>
                  </sanring-tabs-list>
                  <sanring-tabs-content value="overview">
                    <div class="rounded-lg border border-[var(--docs-border)] p-4 text-sm text-[var(--docs-muted)]">
                      Revenue and user activity summary.
                    </div>
                  </sanring-tabs-content>
                  <sanring-tabs-content value="analytics">
                    <div class="rounded-lg border border-[var(--docs-border)] p-4 text-sm text-[var(--docs-muted)]">
                      Conversion, retention, and engagement signals.
                    </div>
                  </sanring-tabs-content>
                  <sanring-tabs-content value="reports">
                    <div class="rounded-lg border border-[var(--docs-border)] p-4 text-sm text-[var(--docs-muted)]">
                      Scheduled exports and stakeholder reports.
                    </div>
                  </sanring-tabs-content>
                </sanring-tabs>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-with-icon')">
            <app-component-page-code-previewer [code]="examples.withIcon" language="angular-html">
              <div previewer class="w-[min(560px,100%)]">
                <sanring-tabs defaultValue="overview">
                  <sanring-tabs-list>
                    <sanring-tabs-trigger value="overview">
                      <svg lucideActivity class="size-4"></svg>
                      <span>{{ i18n.t('tabs.demo.overview') }}</span>
                    </sanring-tabs-trigger>
                    <sanring-tabs-trigger value="security">
                      <svg lucideKey class="size-4"></svg>
                      <span>{{ i18n.t('tabs.demo.security') }}</span>
                    </sanring-tabs-trigger>
                    <sanring-tabs-trigger value="settings">
                      <svg lucideSettings class="size-4"></svg>
                      <span>{{ i18n.t('tabs.demo.settings') }}</span>
                    </sanring-tabs-trigger>
                  </sanring-tabs-list>
                  <sanring-tabs-content value="overview">
                    <div class="rounded-lg border border-[var(--docs-border)] p-4 text-sm text-[var(--docs-muted)]">
                      Key metrics and recent activity.
                    </div>
                  </sanring-tabs-content>
                  <sanring-tabs-content value="security">
                    <div class="rounded-lg border border-[var(--docs-border)] p-4 text-sm text-[var(--docs-muted)]">
                      Access controls and session policy.
                    </div>
                  </sanring-tabs-content>
                  <sanring-tabs-content value="settings">
                    <div class="rounded-lg border border-[var(--docs-border)] p-4 text-sm text-[var(--docs-muted)]">
                      Workspace preferences and defaults.
                    </div>
                  </sanring-tabs-content>
                </sanring-tabs>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-line')">
            <app-component-page-code-previewer [code]="examples.line" language="angular-html">
              <div previewer class="w-[min(560px,100%)]">
                <sanring-tabs defaultValue="overview" variant="line">
                  <sanring-tabs-list>
                    <sanring-tabs-trigger value="overview">
                      {{ i18n.t('tabs.demo.overview') }}
                    </sanring-tabs-trigger>
                    <sanring-tabs-trigger value="analytics">
                      {{ i18n.t('tabs.demo.analytics') }}
                    </sanring-tabs-trigger>
                    <sanring-tabs-trigger value="reports">
                      {{ i18n.t('tabs.demo.reports') }}
                    </sanring-tabs-trigger>
                  </sanring-tabs-list>
                  <sanring-tabs-content value="overview">
                    <p class="mb-0 text-sm leading-6 text-[var(--docs-muted)]">
                      A quieter line style for dense application surfaces.
                    </p>
                  </sanring-tabs-content>
                  <sanring-tabs-content value="analytics">
                    <p class="mb-0 text-sm leading-6 text-[var(--docs-muted)]">
                      Analytics panel with secondary navigation emphasis.
                    </p>
                  </sanring-tabs-content>
                  <sanring-tabs-content value="reports">
                    <p class="mb-0 text-sm leading-6 text-[var(--docs-muted)]">
                      Reports panel content.
                    </p>
                  </sanring-tabs-content>
                </sanring-tabs>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-vertical')">
            <app-component-page-code-previewer [code]="examples.vertical" language="angular-html">
              <div previewer class="w-[min(620px,100%)]">
                <sanring-tabs defaultValue="account" orientation="vertical">
                  <sanring-tabs-list>
                    <sanring-tabs-trigger value="account">
                      {{ i18n.t('tabs.demo.account') }}
                    </sanring-tabs-trigger>
                    <sanring-tabs-trigger value="password">
                      {{ i18n.t('tabs.demo.password') }}
                    </sanring-tabs-trigger>
                    <sanring-tabs-trigger value="notifications">
                      {{ i18n.t('tabs.demo.notifications') }}
                    </sanring-tabs-trigger>
                  </sanring-tabs-list>
                  <sanring-tabs-content value="account" class="mt-0">
                    <div class="rounded-lg border border-[var(--docs-border)] p-4 text-sm leading-6 text-[var(--docs-muted)]">
                      Account preferences and profile controls.
                    </div>
                  </sanring-tabs-content>
                  <sanring-tabs-content value="password" class="mt-0">
                    <div class="rounded-lg border border-[var(--docs-border)] p-4 text-sm leading-6 text-[var(--docs-muted)]">
                      Password and two-factor settings.
                    </div>
                  </sanring-tabs-content>
                  <sanring-tabs-content value="notifications" class="mt-0">
                    <div class="rounded-lg border border-[var(--docs-border)] p-4 text-sm leading-6 text-[var(--docs-muted)]">
                      Email, digest, and product notification settings.
                    </div>
                  </sanring-tabs-content>
                </sanring-tabs>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-disabled')">
            <app-component-page-code-previewer [code]="examples.disabled" language="angular-html">
              <div previewer class="w-[min(520px,100%)]">
                <sanring-tabs defaultValue="account">
                  <sanring-tabs-list>
                    <sanring-tabs-trigger value="account">
                      {{ i18n.t('tabs.demo.account') }}
                    </sanring-tabs-trigger>
                    <sanring-tabs-trigger value="password">
                      {{ i18n.t('tabs.demo.password') }}
                    </sanring-tabs-trigger>
                    <sanring-tabs-trigger value="notifications" disabled>
                      {{ i18n.t('tabs.demo.notifications') }}
                    </sanring-tabs-trigger>
                  </sanring-tabs-list>
                  <sanring-tabs-content value="account">
                    <div class="rounded-lg border border-[var(--docs-border)] p-4 text-sm text-[var(--docs-muted)]">
                      Account settings remain available.
                    </div>
                  </sanring-tabs-content>
                  <sanring-tabs-content value="password">
                    <div class="rounded-lg border border-[var(--docs-border)] p-4 text-sm text-[var(--docs-muted)]">
                      Password settings remain available.
                    </div>
                  </sanring-tabs-content>
                  <sanring-tabs-content value="notifications">
                    <div class="rounded-lg border border-[var(--docs-border)] p-4 text-sm text-[var(--docs-muted)]">
                      Notifications are not available for this plan.
                    </div>
                  </sanring-tabs-content>
                </sanring-tabs>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="section('api')">
        <app-component-page-api-table [rows]="page.apiRows!" />
      </app-component-page-section>
    </app-component-page>
  `,
})
export class TabsPageComponent {
  protected readonly page = tabsPage;
  protected readonly examples = tabsPageExamples;
  protected readonly i18n = inject(I18nService);

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }
}

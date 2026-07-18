import { Component, inject } from '@angular/core';
import { LucideCheck, LucidePlus } from '@lucide/angular';
import { SANRING_AVATAR_IMPORTS } from '@sanring/ui';
import { getComponentPageSection } from '../../../docs-schema/component-page.utils';
import { I18nService } from '../../../i18n/i18n.service';
import {
  ComponentPageApiTableComponent,
  ComponentPageCodeBlock,
  ComponentPageCodePreviewer,
  ComponentPageComponent,
  ComponentPageHeaderComponent,
  ComponentPageInstallationComponent,
  ComponentPageUsageImportsComponent,
  ComponentPageSectionComponent,
} from '../../../layouts/component-page';
import { avatarPage, avatarPageExamples } from './avatar.docs';

@Component({
  selector: 'app-avatar-page',
  imports: [
    SANRING_AVATAR_IMPORTS,
    ComponentPageApiTableComponent,
    ComponentPageCodeBlock,
    ComponentPageCodePreviewer,
    ComponentPageComponent,
    ComponentPageHeaderComponent,
    ComponentPageInstallationComponent,
    ComponentPageUsageImportsComponent,
    ComponentPageSectionComponent,
    LucideCheck,
    LucidePlus,
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
          <div previewer class="flex items-center justify-center">
            <sanring-avatar ariaLabel="Ada Lovelace">
              <img sanringAvatarImage src="https://i.pravatar.cc/96?img=5" alt="Ada Lovelace" />
              <sanring-avatar-fallback>AL</sanring-avatar-fallback>
            </sanring-avatar>
          </div>
        </app-component-page-code-previewer>
      </app-component-page-section>

      <app-component-page-section [section]="section('usage')">
        <div class="grid gap-6">
          <app-component-page-usage-imports
            [code]="examples.usageImport"
            [individualCode]="examples.usageIndividualImports"
          />
          <div
            class="overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]"
          >
            <app-component-page-code-block [code]="examples.usageMain" language="angular-html" />
          </div>
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="section('installation')">
        <app-component-page-installation
          componentName="avatar"
          manualSnippet="import { SANRING_AVATAR_IMPORTS } from './components/ui/avatar';"
        />
      </app-component-page-section>

      <app-component-page-section [section]="section('composition')">
        <div
          class="overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]"
        >
          <app-component-page-code-block [code]="examples.composition" language="bash" />
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="section('example')">
        <div class="grid gap-2">
          <app-component-page-section [section]="section('example-sizes')">
            <app-component-page-code-previewer [code]="examples.sizes" language="angular-html">
              <div previewer class="flex items-center justify-center gap-4">
                <sanring-avatar size="sm" ariaLabel="Small avatar">
                  <sanring-avatar-fallback>SM</sanring-avatar-fallback>
                </sanring-avatar>
                <sanring-avatar ariaLabel="Medium avatar">
                  <sanring-avatar-fallback>MD</sanring-avatar-fallback>
                </sanring-avatar>
                <sanring-avatar size="lg" ariaLabel="Large avatar">
                  <sanring-avatar-fallback>LG</sanring-avatar-fallback>
                </sanring-avatar>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-badge')">
            <app-component-page-code-previewer [code]="examples.badge" language="angular-html">
              <div previewer class="flex items-center justify-center gap-4">
                <sanring-avatar ariaLabel="Online user">
                  <img sanringAvatarImage src="https://i.pravatar.cc/96?img=12" alt="Online user" />
                  <sanring-avatar-fallback>OU</sanring-avatar-fallback>
                  <span sanringAvatarBadge status="online" ariaLabel="Online"></span>
                </sanring-avatar>
                <sanring-avatar ariaLabel="Away user">
                  <sanring-avatar-fallback>AW</sanring-avatar-fallback>
                  <span sanringAvatarBadge status="away" ariaLabel="Away"></span>
                </sanring-avatar>
                <sanring-avatar ariaLabel="Busy user">
                  <sanring-avatar-fallback>BU</sanring-avatar-fallback>
                  <span sanringAvatarBadge status="busy" ariaLabel="Busy"></span>
                </sanring-avatar>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-badge-with-icon')">
            <app-component-page-code-previewer
              [code]="examples.badgeWithIcon"
              language="angular-html"
            >
              <div previewer class="flex items-center justify-center">
                <sanring-avatar ariaLabel="Verified user">
                  <img
                    sanringAvatarImage
                    src="https://i.pravatar.cc/96?img=21"
                    alt="Verified user"
                  />
                  <sanring-avatar-fallback>VU</sanring-avatar-fallback>
                  <span sanringAvatarBadge status="online" ariaLabel="Verified">
                    <svg lucideCheck class="size-2"></svg>
                  </span>
                </sanring-avatar>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-group')">
            <app-component-page-code-previewer [code]="examples.group" language="angular-html">
              <div previewer class="flex items-center justify-center">
                <sanring-avatar-group ariaLabel="Project members">
                  <sanring-avatar ariaLabel="Ada Lovelace">
                    <sanring-avatar-fallback>AL</sanring-avatar-fallback>
                  </sanring-avatar>
                  <sanring-avatar ariaLabel="Grace Hopper">
                    <sanring-avatar-fallback>GH</sanring-avatar-fallback>
                  </sanring-avatar>
                  <sanring-avatar ariaLabel="Katherine Johnson">
                    <sanring-avatar-fallback>KJ</sanring-avatar-fallback>
                  </sanring-avatar>
                  <sanring-avatar-group-count [count]="3" ariaLabel="3 more members" />
                </sanring-avatar-group>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-group-with-icon')">
            <app-component-page-code-previewer
              [code]="examples.groupWithIcon"
              language="angular-html"
            >
              <div previewer class="flex items-center justify-center">
                <sanring-avatar-group ariaLabel="Project members">
                  <sanring-avatar ariaLabel="Ada Lovelace">
                    <sanring-avatar-fallback>AL</sanring-avatar-fallback>
                  </sanring-avatar>
                  <sanring-avatar ariaLabel="Grace Hopper">
                    <sanring-avatar-fallback>GH</sanring-avatar-fallback>
                  </sanring-avatar>
                  <sanring-avatar-group-count ariaLabel="Add member">
                    <svg lucidePlus class="size-4"></svg>
                  </sanring-avatar-group-count>
                </sanring-avatar-group>
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
export class AvatarPageComponent {
  protected readonly page = avatarPage;
  protected readonly examples = avatarPageExamples;
  protected readonly i18n = inject(I18nService);

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }
}

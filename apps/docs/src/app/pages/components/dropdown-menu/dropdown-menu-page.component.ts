import { Component, inject } from '@angular/core';
import {
  LucideCheck,
  LucideChevronRight,
  LucideCircle,
  LucideEllipsis,
  LucideFile,
  LucideFolder,
  LucideSettings,
} from '@lucide/angular';
import { ButtonDirective, SANRING_DROPDOWN_MENU_IMPORTS } from '@sanring/ui';
import { getComponentPageSection } from '../../../docs-schema/component-page.utils';
import { I18nService } from '../../../i18n/i18n.service';
import {
  ComponentPageApiTableComponent,
  ComponentPageCodeBlock,
  ComponentPageCodePreviewer,
  ComponentPageComponent,
  ComponentPageHeaderComponent,
  ComponentPageInstallationComponent,
  ComponentPageSectionComponent,
} from '../../../layouts/component-page';
import { dropdownMenuPage, dropdownMenuPageExamples } from './dropdown-menu.docs';

@Component({
  selector: 'app-dropdown-menu-page',
  imports: [
    ButtonDirective,
    SANRING_DROPDOWN_MENU_IMPORTS,
    LucideCheck,
    LucideChevronRight,
    LucideCircle,
    LucideEllipsis,
    LucideFile,
    LucideFolder,
    LucideSettings,
    ComponentPageApiTableComponent,
    ComponentPageCodeBlock,
    ComponentPageCodePreviewer,
    ComponentPageComponent,
    ComponentPageHeaderComponent,
    ComponentPageInstallationComponent,
    ComponentPageSectionComponent,
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
          <div previewer class="flex min-h-[220px] items-start justify-center pt-8">
            <sanring-dropdown-menu>
              <button sanringBtn variant="outline" [sanringDropdownMenuTrigger]="basicMenu">
                Open
              </button>

              <ng-template #basicMenu let-close="close">
                <sanring-dropdown-menu-content class="w-56">
                  <sanring-dropdown-menu-label>Actions</sanring-dropdown-menu-label>
                  <button sanringDropdownMenuItem type="button" (selected)="close()">
                    New tab
                  </button>
                  <button sanringDropdownMenuItem type="button" (selected)="close()">
                    New window
                  </button>
                  <sanring-dropdown-menu-separator />
                  <button
                    sanringDropdownMenuItem
                    type="button"
                    variant="destructive"
                    (selected)="close()"
                  >
                    Delete
                  </button>
                </sanring-dropdown-menu-content>
              </ng-template>
            </sanring-dropdown-menu>
          </div>
        </app-component-page-code-previewer>
      </app-component-page-section>

      <app-component-page-section [section]="section('usage')">
        <div class="grid gap-6">
          <div
            class="overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]"
          >
            <app-component-page-code-block [code]="examples.usageImport" language="typescript" />
          </div>
          <div
            class="overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]"
          >
            <app-component-page-code-block [code]="examples.usageMain" language="angular-html" />
          </div>
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="section('installation')">
        <app-component-page-installation
          componentName="dropdown-menu"
          manualSnippet="import { SANRING_DROPDOWN_MENU_IMPORTS } from '@sanring/ui';"
        />
      </app-component-page-section>

      <app-component-page-section [section]="section('example')">
        <div class="grid gap-2">
          <app-component-page-section [section]="section('example-checkbox')">
            <app-component-page-code-previewer [code]="examples.checkbox" language="angular-html">
              <div previewer class="flex min-h-[220px] items-start justify-center pt-8">
                <sanring-dropdown-menu>
                  <button sanringBtn variant="outline" [sanringDropdownMenuTrigger]="viewMenu">
                    View
                  </button>

                  <ng-template #viewMenu let-close="close">
                    <sanring-dropdown-menu-content class="w-56">
                      <sanring-dropdown-menu-label>Panels</sanring-dropdown-menu-label>
                      <button
                        sanringDropdownMenuItem
                        type="button"
                        (selected)="showStatusBar = !showStatusBar"
                      >
                        <span class="flex size-4 items-center justify-center">
                          @if (showStatusBar) {
                            <svg lucideCheck class="size-4"></svg>
                          }
                        </span>
                        <span>Status bar</span>
                      </button>
                      <button
                        sanringDropdownMenuItem
                        type="button"
                        (selected)="showActivityBar = !showActivityBar"
                      >
                        <span class="flex size-4 items-center justify-center">
                          @if (showActivityBar) {
                            <svg lucideCheck class="size-4"></svg>
                          }
                        </span>
                        <span>Activity bar</span>
                      </button>
                      <sanring-dropdown-menu-separator />
                      <button sanringDropdownMenuItem type="button" (selected)="close()">
                        Reset layout
                      </button>
                    </sanring-dropdown-menu-content>
                  </ng-template>
                </sanring-dropdown-menu>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-radio')">
            <app-component-page-code-previewer [code]="examples.radio" language="angular-html">
              <div previewer class="flex min-h-[220px] items-start justify-center pt-8">
                <sanring-dropdown-menu>
                  <button sanringBtn variant="outline" [sanringDropdownMenuTrigger]="densityMenu">
                    Density
                  </button>

                  <ng-template #densityMenu let-close="close">
                    <sanring-dropdown-menu-content class="w-56">
                      <sanring-dropdown-menu-label>Density</sanring-dropdown-menu-label>
                      <button
                        sanringDropdownMenuItem
                        type="button"
                        (selected)="density = 'compact'; close()"
                      >
                        <span class="flex size-4 items-center justify-center">
                          @if (density === 'compact') {
                            <svg lucideCircle class="size-2 fill-current"></svg>
                          }
                        </span>
                        <span>Compact</span>
                      </button>
                      <button
                        sanringDropdownMenuItem
                        type="button"
                        (selected)="density = 'comfortable'; close()"
                      >
                        <span class="flex size-4 items-center justify-center">
                          @if (density === 'comfortable') {
                            <svg lucideCircle class="size-2 fill-current"></svg>
                          }
                        </span>
                        <span>Comfortable</span>
                      </button>
                    </sanring-dropdown-menu-content>
                  </ng-template>
                </sanring-dropdown-menu>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-submenu')">
            <app-component-page-code-previewer [code]="examples.submenu" language="angular-html">
              <div previewer class="flex min-h-[260px] items-start justify-center pt-8">
                <sanring-dropdown-menu>
                  <button sanringBtn variant="outline" [sanringDropdownMenuTrigger]="fileMenu">
                    File
                  </button>

                  <ng-template #fileMenu let-close="close">
                    <sanring-dropdown-menu-content
                      class="grid w-[420px] grid-cols-[180px_1fr] gap-1"
                    >
                      <div>
                        <sanring-dropdown-menu-label>File</sanring-dropdown-menu-label>
                        <button
                          sanringDropdownMenuItem
                          type="button"
                          (mouseenter)="submenu = 'share'"
                          (selected)="submenu = 'share'"
                        >
                          <span class="flex-1 text-left">Share</span>
                          <svg lucideChevronRight class="size-4"></svg>
                        </button>
                        <button
                          sanringDropdownMenuItem
                          type="button"
                          (mouseenter)="submenu = 'export'"
                          (selected)="submenu = 'export'"
                        >
                          <span class="flex-1 text-left">Export</span>
                          <svg lucideChevronRight class="size-4"></svg>
                        </button>
                        <sanring-dropdown-menu-separator />
                        <button sanringDropdownMenuItem type="button" (selected)="close()">
                          Close file
                        </button>
                      </div>

                      <div class="border-l border-[var(--sanring-border)] pl-1">
                        <sanring-dropdown-menu-label>
                          {{ submenu === 'share' ? 'Share' : 'Export' }}
                        </sanring-dropdown-menu-label>
                        @if (submenu === 'share') {
                          <button sanringDropdownMenuItem type="button" (selected)="close()">
                            Copy link
                          </button>
                          <button sanringDropdownMenuItem type="button" (selected)="close()">
                            Invite people
                          </button>
                        } @else {
                          <button sanringDropdownMenuItem type="button" (selected)="close()">
                            PDF
                          </button>
                          <button sanringDropdownMenuItem type="button" (selected)="close()">
                            Markdown
                          </button>
                        }
                      </div>
                    </sanring-dropdown-menu-content>
                  </ng-template>
                </sanring-dropdown-menu>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-with-icons')">
            <app-component-page-code-previewer [code]="examples.withIcons" language="angular-html">
              <div previewer class="flex min-h-[220px] items-start justify-center pt-8">
                <sanring-dropdown-menu>
                  <button sanringBtn variant="outline" [sanringDropdownMenuTrigger]="moreMenu">
                    <svg lucideEllipsis class="size-4"></svg>
                    More
                  </button>

                  <ng-template #moreMenu let-close="close">
                    <sanring-dropdown-menu-content class="w-56">
                      <button sanringDropdownMenuItem type="button" (selected)="close()">
                        <svg lucideFile class="size-4"></svg>
                        <span>New file</span>
                      </button>
                      <button sanringDropdownMenuItem type="button" (selected)="close()">
                        <svg lucideFolder class="size-4"></svg>
                        <span>New folder</span>
                      </button>
                      <sanring-dropdown-menu-separator />
                      <button sanringDropdownMenuItem type="button" (selected)="close()">
                        <svg lucideSettings class="size-4"></svg>
                        <span>Preferences</span>
                      </button>
                    </sanring-dropdown-menu-content>
                  </ng-template>
                </sanring-dropdown-menu>
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
export class DropdownMenuPageComponent {
  protected readonly page = dropdownMenuPage;
  protected readonly examples = dropdownMenuPageExamples;
  protected readonly i18n = inject(I18nService);

  protected showStatusBar = true;
  protected showActivityBar = false;
  protected density: 'compact' | 'comfortable' = 'comfortable';
  protected submenu: 'share' | 'export' = 'share';

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }
}

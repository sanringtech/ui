import { Component, inject } from '@angular/core';
import {
  LucideBookOpen,
  LucideBox,
  LucideChevronRight,
  LucideFileText,
  LucideFolder,
  LucideLayoutDashboard,
  LucideMap,
  LucidePalette,
  LucideRocket,
  LucideSparkles,
} from '@lucide/angular';
import { NavigationMenuValue, SANRING_NAVIGATION_MENU_IMPORTS } from '@sanring/ui';
import { getComponentPageSection } from '../../../docs-schema/component-page.utils';
import { I18nService } from '../../../i18n/i18n.service';
import {
  ComponentPageApiTableComponent,
  ComponentPageCodeBlock,
  ComponentPageCodePreviewer,
  ComponentPageComponent,
  ComponentPageHeaderComponent,
  ComponentPageInstallationComponent,
  ComponentPageKeyboardTableComponent,
  ComponentPageSectionComponent,
  ComponentPageUsageImportsComponent,
} from '../../../layouts/component-page';
import { navigationMenuPage, navigationMenuPageExamples } from './navigation-menu.docs';

@Component({
  selector: 'app-navigation-menu-page',
  imports: [
    SANRING_NAVIGATION_MENU_IMPORTS,
    ComponentPageApiTableComponent,
    ComponentPageCodeBlock,
    ComponentPageCodePreviewer,
    ComponentPageComponent,
    ComponentPageHeaderComponent,
    ComponentPageInstallationComponent,
    ComponentPageKeyboardTableComponent,
    ComponentPageSectionComponent,
    ComponentPageUsageImportsComponent,
    LucideBookOpen,
    LucideBox,
    LucideChevronRight,
    LucideFileText,
    LucideFolder,
    LucideLayoutDashboard,
    LucideMap,
    LucidePalette,
    LucideRocket,
    LucideSparkles,
  ],
  template: `
    <app-component-page [sections]="page.sections">
      <app-component-page-header
        [componentId]="page.componentId"
        [title]="i18n.t(page.titleKey)"
        [description]="i18n.t(page.descriptionKey)"
      />

      <app-component-page-section [section]="section('basic')">
        <app-component-page-code-previewer
          [code]="examples.basic"
          language="angular-html"
          [wide]="true"
        >
          <div previewer class="flex min-h-[560px] w-full items-start justify-center p-4">
            <div
              class="w-full max-w-[1080px] rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--sanring-background)] shadow-sm"
            >
              <div
                class="flex min-h-16 items-center gap-3 border-b border-[var(--sanring-border)] px-4"
              >
                <div
                  class="flex size-9 shrink-0 items-center justify-center rounded-[var(--sanring-radius)] bg-[var(--sanring-foreground)] text-[var(--sanring-background)]"
                >
                  <svg lucideSparkles class="size-4"></svg>
                </div>
                <sanring-navigation-menu ariaLabel="Sanring product navigation" class="min-w-0">
                  <sanring-navigation-menu-list class="justify-start">
                    <sanring-navigation-menu-item value="product">
                      <button sanringNavigationMenuTrigger>
                        Product
                        <svg lucideChevronRight class="size-4 rotate-90 opacity-70"></svg>
                      </button>
                      <sanring-navigation-menu-content class="w-[420px] p-3">
                        <div class="grid gap-3 sm:grid-cols-[1fr_1.2fr]">
                          <a
                            sanringNavigationMenuLink
                            href="#"
                            class="min-h-44 flex-col justify-end bg-[var(--sanring-foreground)] p-4 text-[var(--sanring-background)] hover:bg-[var(--sanring-foreground)]"
                            (click)="$event.preventDefault()"
                          >
                            <svg lucideRocket class="size-6"></svg>
                            <div>
                              <sanring-navigation-menu-label class="text-[var(--sanring-background)]">
                                Sanring UI
                              </sanring-navigation-menu-label>
                              <p
                                sanringNavigationMenuDescription
                                class="mt-2 text-[color-mix(in_srgb,var(--sanring-background)_78%,transparent)]"
                              >
                                Headless Angular primitives with predictable styling hooks.
                              </p>
                            </div>
                          </a>
                          <div class="grid gap-1">
                            <a sanringNavigationMenuLink href="#" (click)="$event.preventDefault()">
                              <svg lucideBox class="mt-0.5 size-4 shrink-0 text-[var(--sanring-muted)]"></svg>
                              <div>
                                <sanring-navigation-menu-label>Components</sanring-navigation-menu-label>
                                <p sanringNavigationMenuDescription>
                                  Dialogs, forms, overlays, display blocks, and navigation.
                                </p>
                              </div>
                            </a>
                            <a sanringNavigationMenuLink href="#" (click)="$event.preventDefault()">
                              <svg lucidePalette class="mt-0.5 size-4 shrink-0 text-[var(--sanring-muted)]"></svg>
                              <div>
                                <sanring-navigation-menu-label>Theming</sanring-navigation-menu-label>
                                <p sanringNavigationMenuDescription>
                                  Customize the --sanring-* token layer once.
                                </p>
                              </div>
                            </a>
                            <a sanringNavigationMenuLink href="#" (click)="$event.preventDefault()">
                              <svg lucideLayoutDashboard class="mt-0.5 size-4 shrink-0 text-[var(--sanring-muted)]"></svg>
                              <div>
                                <sanring-navigation-menu-label>Examples</sanring-navigation-menu-label>
                                <p sanringNavigationMenuDescription>
                                  Production-shaped layouts composed from primitives.
                                </p>
                              </div>
                            </a>
                          </div>
                        </div>
                      </sanring-navigation-menu-content>
                    </sanring-navigation-menu-item>

                    <sanring-navigation-menu-item value="resources">
                      <button sanringNavigationMenuTrigger>
                        Resources
                        <svg lucideChevronRight class="size-4 rotate-90 opacity-70"></svg>
                      </button>
                      <sanring-navigation-menu-content class="w-72 p-2">
                        <a sanringNavigationMenuLink href="#" (click)="$event.preventDefault()">
                          <svg lucideBookOpen class="size-4 shrink-0 text-[var(--sanring-muted)]"></svg>
                          Guides
                        </a>
                        <a sanringNavigationMenuLink href="#" (click)="$event.preventDefault()">
                          <svg lucideFileText class="size-4 shrink-0 text-[var(--sanring-muted)]"></svg>
                          Changelog
                        </a>
                        <a sanringNavigationMenuLink href="#" (click)="$event.preventDefault()">
                          <svg lucideMap class="size-4 shrink-0 text-[var(--sanring-muted)]"></svg>
                          Roadmap
                        </a>
                        <sanring-navigation-menu-separator />
                        <a sanringNavigationMenuLink href="#" (click)="$event.preventDefault()">
                          <svg lucideFolder class="size-4 shrink-0 text-[var(--sanring-muted)]"></svg>
                          Repository
                        </a>
                      </sanring-navigation-menu-content>
                    </sanring-navigation-menu-item>

                    <sanring-navigation-menu-item value="docs">
                      <button sanringNavigationMenuTrigger>
                        Docs
                        <svg lucideChevronRight class="size-4 rotate-90 opacity-70"></svg>
                      </button>
                      <sanring-navigation-menu-content class="w-72 p-2">
                        <a
                          sanringNavigationMenuLink
                          href="#"
                          active
                          (click)="$event.preventDefault()"
                        >
                          <div>
                            <sanring-navigation-menu-label>Introduction</sanring-navigation-menu-label>
                            <p sanringNavigationMenuDescription>
                              Start here for the core concepts.
                            </p>
                          </div>
                        </a>
                        <a sanringNavigationMenuLink href="#" (click)="$event.preventDefault()">
                          <div>
                            <sanring-navigation-menu-label>Installation</sanring-navigation-menu-label>
                            <p sanringNavigationMenuDescription>
                              Add the CLI or copy component source.
                            </p>
                          </div>
                        </a>
                        <a sanringNavigationMenuLink href="#" (click)="$event.preventDefault()">
                          <div>
                            <sanring-navigation-menu-label>CLI</sanring-navigation-menu-label>
                            <p sanringNavigationMenuDescription>
                              Command reference for add, diff, update.
                            </p>
                          </div>
                        </a>
                      </sanring-navigation-menu-content>
                    </sanring-navigation-menu-item>
                  </sanring-navigation-menu-list>
                </sanring-navigation-menu>

                <div class="ml-auto hidden items-center gap-2 text-xs text-[var(--sanring-muted)] sm:flex">
                  <span class="rounded-[var(--sanring-radius-xs)] border border-[var(--sanring-border)] px-2 py-1">
                    v0.17
                  </span>
                </div>
              </div>
              <div class="grid gap-4 p-6 sm:grid-cols-3">
                <div class="rounded-[var(--sanring-radius)] border border-[var(--sanring-border)] p-5">
                  <div class="text-sm font-medium">Angular-first</div>
                  <div class="mt-1 text-sm text-[var(--sanring-muted)]">Standalone imports and template-native APIs.</div>
                </div>
                <div class="rounded-[var(--sanring-radius)] border border-[var(--sanring-border)] p-5">
                  <div class="text-sm font-medium">Composable</div>
                  <div class="mt-1 text-sm text-[var(--sanring-muted)]">Use links, triggers, panels, labels, and descriptions separately.</div>
                </div>
                <div class="rounded-[var(--sanring-radius)] border border-[var(--sanring-border)] p-5">
                  <div class="text-sm font-medium">Token driven</div>
                  <div class="mt-1 text-sm text-[var(--sanring-muted)]">Every state maps back to the shared theme layer.</div>
                </div>
              </div>
            </div>
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
          componentName="navigation-menu"
          manualSnippet="import { SANRING_NAVIGATION_MENU_IMPORTS } from './components/ui/navigation-menu';"
        />
      </app-component-page-section>

      <app-component-page-section [section]="section('example')">
        <div class="grid gap-2">
          <app-component-page-section [section]="section('example-viewport')">
            <app-component-page-code-previewer
              [code]="examples.viewport"
              language="angular-html"
              [wide]="true"
            >
              <div previewer class="flex w-full items-start justify-center pt-8">
                <sanring-navigation-menu [(value)]="navValue">
                  <sanring-navigation-menu-list class="gap-6">
                    <sanring-navigation-menu-item value="product">
                      <button sanringNavigationMenuTrigger>Product</button>
                    </sanring-navigation-menu-item>
                    <sanring-navigation-menu-item value="solutions">
                      <button sanringNavigationMenuTrigger>Solutions</button>
                    </sanring-navigation-menu-item>
                    <sanring-navigation-menu-item value="enterprise">
                      <button sanringNavigationMenuTrigger>Enterprise</button>
                    </sanring-navigation-menu-item>
                    <sanring-navigation-menu-item>
                      <a sanringNavigationMenuLink href="#" (click)="$event.preventDefault()">
                        Pricing
                      </a>
                    </sanring-navigation-menu-item>
                  </sanring-navigation-menu-list>

                  <sanring-navigation-menu-viewport class="w-80">
                    @switch (navValue) {
                      @case ('product') {
                        <div class="grid gap-1 p-3">
                          <a sanringNavigationMenuLink href="#" (click)="$event.preventDefault()">
                            Overview
                          </a>
                          <a sanringNavigationMenuLink href="#" (click)="$event.preventDefault()">
                            Integrations
                          </a>
                        </div>
                      }
                      @case ('solutions') {
                        <div class="grid gap-1 p-3">
                          <a sanringNavigationMenuLink href="#" (click)="$event.preventDefault()">
                            For startups
                          </a>
                          <a sanringNavigationMenuLink href="#" (click)="$event.preventDefault()">
                            For enterprise
                          </a>
                        </div>
                      }
                      @case ('enterprise') {
                        <div class="grid gap-1 p-3">
                          <a sanringNavigationMenuLink href="#" (click)="$event.preventDefault()">
                            Security
                          </a>
                          <a sanringNavigationMenuLink href="#" (click)="$event.preventDefault()">
                            Single sign-on
                          </a>
                        </div>
                      }
                    }
                  </sanring-navigation-menu-viewport>
                </sanring-navigation-menu>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-submenu')">
            <app-component-page-code-previewer [code]="examples.submenu" language="angular-html">
              <div previewer class="flex min-h-[260px] items-start justify-center pt-8">
                <sanring-navigation-menu>
                  <sanring-navigation-menu-list>
                    <sanring-navigation-menu-item value="docs">
                      <button sanringNavigationMenuTrigger>Docs</button>
                      <sanring-navigation-menu-content class="w-64 p-2">
                        <a
                          sanringNavigationMenuLink
                          href="#"
                          role="menuitem"
                          tabindex="0"
                          (click)="$event.preventDefault()"
                        >
                          Overview
                        </a>

                        <sanring-navigation-menu-sub>
                          <sanring-navigation-menu-sub-trigger>
                            Components
                          </sanring-navigation-menu-sub-trigger>
                          <sanring-navigation-menu-sub-content class="w-48">
                            <a
                              sanringNavigationMenuLink
                              href="#"
                              role="menuitem"
                              tabindex="0"
                              (click)="$event.preventDefault()"
                            >
                              Forms
                            </a>
                            <a
                              sanringNavigationMenuLink
                              href="#"
                              role="menuitem"
                              tabindex="0"
                              (click)="$event.preventDefault()"
                            >
                              Overlays
                            </a>
                            <a
                              sanringNavigationMenuLink
                              href="#"
                              role="menuitem"
                              tabindex="0"
                              (click)="$event.preventDefault()"
                            >
                              Navigation
                            </a>
                          </sanring-navigation-menu-sub-content>
                        </sanring-navigation-menu-sub>

                        <a
                          sanringNavigationMenuLink
                          href="#"
                          role="menuitem"
                          tabindex="0"
                          (click)="$event.preventDefault()"
                        >
                          Theming
                        </a>
                      </sanring-navigation-menu-content>
                    </sanring-navigation-menu-item>
                  </sanring-navigation-menu-list>
                </sanring-navigation-menu>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-vertical')">
            <app-component-page-code-previewer [code]="examples.vertical" language="angular-html">
              <div previewer class="flex min-h-[280px] items-start justify-center pt-8">
                <sanring-navigation-menu orientation="vertical" class="w-56">
                  <sanring-navigation-menu-list>
                    <sanring-navigation-menu-item>
                      <a sanringNavigationMenuLink href="#" active (click)="$event.preventDefault()">
                        Dashboard
                      </a>
                    </sanring-navigation-menu-item>
                    <sanring-navigation-menu-item>
                      <a sanringNavigationMenuLink href="#" (click)="$event.preventDefault()">
                        Analytics
                      </a>
                    </sanring-navigation-menu-item>

                    <sanring-navigation-menu-item>
                      <button sanringNavigationMenuTrigger class="w-full justify-between">
                        Team
                        <svg lucideChevronRight class="size-4 shrink-0 opacity-70"></svg>
                      </button>
                      <sanring-navigation-menu-content
                        class="left-full top-0 mt-0 ml-2 w-52 min-w-0 p-2"
                      >
                        <a sanringNavigationMenuLink href="#" (click)="$event.preventDefault()">
                          Members
                        </a>
                        <a sanringNavigationMenuLink href="#" (click)="$event.preventDefault()">
                          Invite people
                        </a>
                        <a sanringNavigationMenuLink href="#" (click)="$event.preventDefault()">
                          Roles &amp; permissions
                        </a>
                      </sanring-navigation-menu-content>
                    </sanring-navigation-menu-item>

                    <sanring-navigation-menu-item>
                      <a sanringNavigationMenuLink href="#" (click)="$event.preventDefault()">
                        Settings
                      </a>
                    </sanring-navigation-menu-item>

                    <sanring-navigation-menu-separator />

                    <sanring-navigation-menu-item>
                      <a
                        sanringNavigationMenuLink
                        href="#"
                        disabled
                        (click)="$event.preventDefault()"
                      >
                        Billing (coming soon)
                      </a>
                    </sanring-navigation-menu-item>
                  </sanring-navigation-menu-list>
                </sanring-navigation-menu>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="section('api')">
        <app-component-page-api-table [rows]="page.apiRows!" />
      </app-component-page-section>

      <app-component-page-section [section]="section('accessibility')" />

      <app-component-page-section [section]="section('keyboard')">
        <app-component-page-keyboard-table [rows]="page.keyboardRows!" />
      </app-component-page-section>

      <app-component-page-section [section]="section('stateModel')" />
    </app-component-page>
  `,
})
export class NavigationMenuPageComponent {
  protected readonly page = navigationMenuPage;
  protected readonly examples = navigationMenuPageExamples;
  protected readonly i18n = inject(I18nService);

  protected navValue: NavigationMenuValue = null;

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }
}

import { Component, inject } from '@angular/core';
import {
  LucideAudioWaveform,
  LucideBadgeCheck,
  LucideBell,
  LucideChartPie,
  LucideChevronRight,
  LucideChevronsUpDown,
  LucideCommand,
  LucideCreditCard,
  LucideEllipsis,
  LucideFolder,
  LucideFrame,
  LucideGalleryVerticalEnd,
  LucideLayoutDashboard,
  LucideLogOut,
  LucideMap,
  LucideMenu,
  LucidePanelsTopLeft,
  LucidePlus,
  LucideSettings,
  LucideShare,
  LucideSparkles,
  LucideTrash2,
  LucideUsers,
} from '@lucide/angular';
import {
  ButtonDirective,
  SANRING_COLLAPSIBLE_IMPORTS,
  SANRING_DROPDOWN_MENU_IMPORTS,
  SANRING_SIDEBAR_IMPORTS,
} from '@sanring/ui';
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
import { sidebarPage, sidebarPageExamples } from './sidebar.docs';

@Component({
  selector: 'app-sidebar-page',
  imports: [
    ButtonDirective,
    ComponentPageApiTableComponent,
    ComponentPageCodeBlock,
    ComponentPageCodePreviewer,
    ComponentPageComponent,
    ComponentPageHeaderComponent,
    ComponentPageInstallationComponent,
    ComponentPageKeyboardTableComponent,
    ComponentPageSectionComponent,
    ComponentPageUsageImportsComponent,
    LucideAudioWaveform,
    LucideBadgeCheck,
    LucideBell,
    LucideChartPie,
    LucideChevronRight,
    LucideChevronsUpDown,
    LucideCommand,
    LucideCreditCard,
    LucideEllipsis,
    LucideFolder,
    LucideFrame,
    LucideGalleryVerticalEnd,
    LucideLayoutDashboard,
    LucideLogOut,
    LucideMap,
    LucideMenu,
    LucidePanelsTopLeft,
    LucidePlus,
    LucideSettings,
    LucideShare,
    LucideSparkles,
    LucideTrash2,
    LucideUsers,
    SANRING_COLLAPSIBLE_IMPORTS,
    SANRING_DROPDOWN_MENU_IMPORTS,
    SANRING_SIDEBAR_IMPORTS,
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
          <div previewer class="flex w-full justify-center">
            <sanring-sidebar-provider collapsible="icon" #sidebarProvider>
            <div
              class="flex h-[620px] w-full max-w-[860px] overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--sanring-background)]"
            >
              @let isOpen = sidebarProvider.isOpen();
              <sanring-sidebar
                class="shrink-0"
              >
                <sanring-sidebar-header>
                  <sanring-dropdown-menu>
                    <button
                      type="button"
                      sanringDropdownMenuTrigger
                      [menu]="teamMenu.menu"
                      side="right"
                      align="start"
                      class="flex min-w-0 items-center rounded-[var(--sanring-radius)] transition-colors hover:bg-[var(--sanring-surface-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sanring-border-strong)]"
                      [class.w-full]="isOpen"
                      [class.gap-3]="isOpen"
                      [class.p-2]="isOpen"
                      [class.size-10]="!isOpen"
                      [class.justify-center]="!isOpen"
                      [attr.aria-label]="i18n.t('sidebar.demo.switchTeam')"
                    >
                      <div
                        class="flex size-9 shrink-0 items-center justify-center rounded-[var(--sanring-radius)] bg-[var(--sanring-foreground)] text-[var(--sanring-background)]"
                      >
                        <svg lucideGalleryVerticalEnd class="size-5"></svg>
                      </div>
                      @if (isOpen) {
                        <div class="min-w-0 text-left">
                          <div class="truncate text-sm font-semibold">Acme Inc</div>
                          <div class="truncate text-xs text-[var(--sanring-muted-foreground)]">
                            Enterprise
                          </div>
                        </div>
                        <svg lucideChevronsUpDown class="ml-auto size-4 shrink-0"></svg>
                      }
                    </button>
                    <sanring-dropdown-menu-content
                      #teamMenu="sanringDropdownMenuContent"
                      class="w-64"
                    >
                      <sanring-dropdown-menu-label>{{
                        i18n.t('sidebar.demo.teams')
                      }}</sanring-dropdown-menu-label>
                      <button type="button" sanringDropdownMenuItem value="acme">
                        <span
                          class="flex size-7 items-center justify-center rounded-[var(--sanring-radius-xs)] border border-[var(--sanring-border)]"
                        >
                          <svg lucideGalleryVerticalEnd class="size-4"></svg>
                        </span>
                        <span class="min-w-0 flex-1 truncate">Acme Inc</span>
                        <span class="text-xs text-[var(--sanring-muted-foreground)]">⌘ 1</span>
                      </button>
                      <button type="button" sanringDropdownMenuItem value="acme-corp">
                        <span
                          class="flex size-7 items-center justify-center rounded-[var(--sanring-radius-xs)] border border-[var(--sanring-border)]"
                        >
                          <svg lucideAudioWaveform class="size-4"></svg>
                        </span>
                        <span class="min-w-0 flex-1 truncate">Acme Corp.</span>
                        <span class="text-xs text-[var(--sanring-muted-foreground)]">⌘ 2</span>
                      </button>
                      <button type="button" sanringDropdownMenuItem value="evil-corp">
                        <span
                          class="flex size-7 items-center justify-center rounded-[var(--sanring-radius-xs)] border border-[var(--sanring-border)]"
                        >
                          <svg lucideCommand class="size-4"></svg>
                        </span>
                        <span class="min-w-0 flex-1 truncate">Evil Corp.</span>
                        <span class="text-xs text-[var(--sanring-muted-foreground)]">⌘ 3</span>
                      </button>
                      <sanring-dropdown-menu-separator />
                      <button type="button" sanringDropdownMenuItem value="add-team">
                        <span
                          class="flex size-7 items-center justify-center rounded-[var(--sanring-radius-xs)] border border-[var(--sanring-border)]"
                        >
                          <svg lucidePlus class="size-4"></svg>
                        </span>
                        <span>{{ i18n.t('sidebar.demo.addTeam') }}</span>
                      </button>
                    </sanring-dropdown-menu-content>
                  </sanring-dropdown-menu>
                </sanring-sidebar-header>
                <sanring-sidebar-content>
                  <sanring-sidebar-group>
                    @if (isOpen) {
                      <sanring-sidebar-group-label>{{
                        i18n.t('sidebar.demo.platform')
                      }}</sanring-sidebar-group-label>
                    }
                    <sanring-sidebar-group-content>
                      <sanring-sidebar-menu>
                        <sanring-sidebar-menu-item>
                          <sanring-collapsible [open]="true">
                            <button
                              type="button"
                              sanringSidebarMenuButton
                              active
                              sanringCollapsibleTrigger
                            >
                              <svg lucideLayoutDashboard class="size-4 shrink-0"></svg>
                              @if (isOpen) {
                                <span class="truncate">{{ i18n.t('sidebar.demo.dashboard') }}</span>
                                <svg lucideChevronRight class="ml-auto size-4 shrink-0"></svg>
                              }
                            </button>
                            @if (isOpen) {
                              <sanring-sidebar-menu-sub sanringCollapsibleContent>
                                <sanring-sidebar-menu-sub-item>
                                  <a
                                    href="#"
                                    class="block rounded-[var(--sanring-radius-xs)] px-2 py-1.5 text-sm hover:bg-[var(--sanring-surface-strong)]"
                                    (click)="$event.preventDefault()"
                                  >
                                    {{ i18n.t('sidebar.demo.overview') }}
                                  </a>
                                </sanring-sidebar-menu-sub-item>
                                <sanring-sidebar-menu-sub-item>
                                  <a
                                    href="#"
                                    class="block rounded-[var(--sanring-radius-xs)] px-2 py-1.5 text-sm hover:bg-[var(--sanring-surface-strong)]"
                                    (click)="$event.preventDefault()"
                                  >
                                    {{ i18n.t('sidebar.demo.reports') }}
                                  </a>
                                </sanring-sidebar-menu-sub-item>
                              </sanring-sidebar-menu-sub>
                            }
                          </sanring-collapsible>
                        </sanring-sidebar-menu-item>
                        <sanring-sidebar-menu-item>
                          <sanring-collapsible>
                            <button
                              type="button"
                              sanringSidebarMenuButton
                              sanringCollapsibleTrigger
                            >
                              <svg lucideUsers class="size-4 shrink-0"></svg>
                              @if (isOpen) {
                                <span class="truncate">{{ i18n.t('sidebar.demo.customers') }}</span>
                                <svg lucideChevronRight class="ml-auto size-4 shrink-0"></svg>
                              }
                            </button>
                            @if (isOpen) {
                              <sanring-sidebar-menu-sub sanringCollapsibleContent>
                                <sanring-sidebar-menu-sub-item>
                                  <a
                                    href="#"
                                    class="block rounded-[var(--sanring-radius-xs)] px-2 py-1.5 text-sm hover:bg-[var(--sanring-surface-strong)]"
                                    (click)="$event.preventDefault()"
                                  >
                                    {{ i18n.t('sidebar.demo.accounts') }}
                                  </a>
                                </sanring-sidebar-menu-sub-item>
                                <sanring-sidebar-menu-sub-item>
                                  <a
                                    href="#"
                                    class="block rounded-[var(--sanring-radius-xs)] px-2 py-1.5 text-sm hover:bg-[var(--sanring-surface-strong)]"
                                    (click)="$event.preventDefault()"
                                  >
                                    {{ i18n.t('sidebar.demo.segments') }}
                                  </a>
                                </sanring-sidebar-menu-sub-item>
                              </sanring-sidebar-menu-sub>
                            }
                          </sanring-collapsible>
                        </sanring-sidebar-menu-item>
                        <sanring-sidebar-menu-item>
                          <sanring-collapsible>
                            <button
                              type="button"
                              sanringSidebarMenuButton
                              sanringCollapsibleTrigger
                            >
                              <svg lucideBell class="size-4 shrink-0"></svg>
                              @if (isOpen) {
                                <span class="truncate">{{
                                  i18n.t('sidebar.demo.notifications')
                                }}</span>
                                <svg lucideChevronRight class="ml-auto size-4 shrink-0"></svg>
                              }
                            </button>
                            @if (isOpen) {
                              <sanring-sidebar-menu-sub sanringCollapsibleContent>
                                <sanring-sidebar-menu-sub-item>
                                  <a
                                    href="#"
                                    class="block rounded-[var(--sanring-radius-xs)] px-2 py-1.5 text-sm hover:bg-[var(--sanring-surface-strong)]"
                                    (click)="$event.preventDefault()"
                                  >
                                    {{ i18n.t('sidebar.demo.inbox') }}
                                  </a>
                                </sanring-sidebar-menu-sub-item>
                                <sanring-sidebar-menu-sub-item>
                                  <a
                                    href="#"
                                    class="block rounded-[var(--sanring-radius-xs)] px-2 py-1.5 text-sm hover:bg-[var(--sanring-surface-strong)]"
                                    (click)="$event.preventDefault()"
                                  >
                                    {{ i18n.t('sidebar.demo.rules') }}
                                  </a>
                                </sanring-sidebar-menu-sub-item>
                              </sanring-sidebar-menu-sub>
                            }
                          </sanring-collapsible>
                        </sanring-sidebar-menu-item>
                      </sanring-sidebar-menu>
                    </sanring-sidebar-group-content>
                  </sanring-sidebar-group>
                  @if (isOpen) {
                    <sanring-sidebar-group class="mt-2">
                      <sanring-sidebar-group-label>{{
                        i18n.t('sidebar.demo.projects')
                      }}</sanring-sidebar-group-label>
                      <sanring-sidebar-group-content>
                        <sanring-sidebar-menu>
                          <sanring-sidebar-menu-item>
                            <a href="#" sanringSidebarMenuButton (click)="$event.preventDefault()">
                              <svg lucideFrame class="size-4 shrink-0"></svg>
                              <span class="truncate">{{
                                i18n.t('sidebar.demo.designEngineering')
                              }}</span>
                            </a>
                            <sanring-dropdown-menu>
                              <button
                                type="button"
                                sanringSidebarMenuAction
                                sanringDropdownMenuTrigger
                                [menu]="designProjectMenu.menu"
                                side="right"
                                align="start"
                                [attr.aria-label]="i18n.t('sidebar.demo.projectActions')"
                              >
                                <svg lucideEllipsis class="size-4"></svg>
                              </button>
                              <sanring-dropdown-menu-content
                                #designProjectMenu="sanringDropdownMenuContent"
                                class="w-48"
                              >
                                <button type="button" sanringDropdownMenuItem value="view-project">
                                  <svg lucideFolder class="size-4"></svg>
                                  <span>{{ i18n.t('sidebar.demo.viewProject') }}</span>
                                </button>
                                <button type="button" sanringDropdownMenuItem value="share-project">
                                  <svg lucideShare class="size-4"></svg>
                                  <span>{{ i18n.t('sidebar.demo.shareProject') }}</span>
                                </button>
                                <sanring-dropdown-menu-separator />
                                <button
                                  type="button"
                                  sanringDropdownMenuItem
                                  value="delete-project"
                                  variant="destructive"
                                >
                                  <svg lucideTrash2 class="size-4"></svg>
                                  <span>{{ i18n.t('sidebar.demo.deleteProject') }}</span>
                                </button>
                              </sanring-dropdown-menu-content>
                            </sanring-dropdown-menu>
                          </sanring-sidebar-menu-item>
                          <sanring-sidebar-menu-item>
                            <a href="#" sanringSidebarMenuButton (click)="$event.preventDefault()">
                              <svg lucideChartPie class="size-4 shrink-0"></svg>
                              <span class="truncate">{{
                                i18n.t('sidebar.demo.salesMarketing')
                              }}</span>
                            </a>
                            <sanring-dropdown-menu>
                              <button
                                type="button"
                                sanringSidebarMenuAction
                                sanringDropdownMenuTrigger
                                [menu]="salesProjectMenu.menu"
                                side="right"
                                align="start"
                                [attr.aria-label]="i18n.t('sidebar.demo.projectActions')"
                              >
                                <svg lucideEllipsis class="size-4"></svg>
                              </button>
                              <sanring-dropdown-menu-content
                                #salesProjectMenu="sanringDropdownMenuContent"
                                class="w-48"
                              >
                                <button type="button" sanringDropdownMenuItem value="view-project">
                                  <svg lucideFolder class="size-4"></svg>
                                  <span>{{ i18n.t('sidebar.demo.viewProject') }}</span>
                                </button>
                                <button type="button" sanringDropdownMenuItem value="share-project">
                                  <svg lucideShare class="size-4"></svg>
                                  <span>{{ i18n.t('sidebar.demo.shareProject') }}</span>
                                </button>
                                <sanring-dropdown-menu-separator />
                                <button
                                  type="button"
                                  sanringDropdownMenuItem
                                  value="delete-project"
                                  variant="destructive"
                                >
                                  <svg lucideTrash2 class="size-4"></svg>
                                  <span>{{ i18n.t('sidebar.demo.deleteProject') }}</span>
                                </button>
                              </sanring-dropdown-menu-content>
                            </sanring-dropdown-menu>
                          </sanring-sidebar-menu-item>
                          <sanring-sidebar-menu-item>
                            <a href="#" sanringSidebarMenuButton (click)="$event.preventDefault()">
                              <svg lucideMap class="size-4 shrink-0"></svg>
                              <span class="truncate">{{ i18n.t('sidebar.demo.travel') }}</span>
                            </a>
                          </sanring-sidebar-menu-item>
                          <sanring-sidebar-menu-item>
                            <a
                              href="#"
                              sanringSidebarMenuButton
                              class="text-[var(--sanring-muted-foreground)]"
                              (click)="$event.preventDefault()"
                            >
                              <svg lucideEllipsis class="size-4 shrink-0"></svg>
                              <span class="truncate">{{ i18n.t('sidebar.demo.more') }}</span>
                            </a>
                          </sanring-sidebar-menu-item>
                        </sanring-sidebar-menu>
                      </sanring-sidebar-group-content>
                    </sanring-sidebar-group>
                  }
                </sanring-sidebar-content>
                <sanring-sidebar-footer>
                  <sanring-dropdown-menu>
                    <button
                      type="button"
                      sanringDropdownMenuTrigger
                      [menu]="accountMenu.menu"
                      side="right"
                      align="end"
                      class="flex min-w-0 items-center rounded-[var(--sanring-radius)] transition-colors hover:bg-[var(--sanring-surface-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sanring-border-strong)]"
                      [class.w-full]="isOpen"
                      [class.gap-3]="isOpen"
                      [class.p-2]="isOpen"
                      [class.size-10]="!isOpen"
                      [class.justify-center]="!isOpen"
                      [attr.aria-label]="i18n.t('sidebar.demo.accountMenu')"
                    >
                      <img
                        src="https://i.pravatar.cc/80?img=5"
                        alt=""
                        class="size-9 shrink-0 rounded-full"
                      />
                      @if (isOpen) {
                        <span class="min-w-0 flex-1 text-left">
                          <span class="block truncate text-sm font-medium">shadcn</span>
                          <span
                            class="block truncate text-xs text-[var(--sanring-muted-foreground)]"
                          >
                            m@example.com
                          </span>
                        </span>
                        <svg lucideChevronsUpDown class="size-4 shrink-0"></svg>
                      }
                    </button>
                    <sanring-dropdown-menu-content
                      #accountMenu="sanringDropdownMenuContent"
                      class="w-64"
                    >
                      <div class="flex min-w-0 items-center gap-3 px-2 py-2">
                        <img
                          src="https://i.pravatar.cc/80?img=5"
                          alt=""
                          class="size-9 shrink-0 rounded-full"
                        />
                        <div class="min-w-0">
                          <div class="truncate text-sm font-medium">shadcn</div>
                          <div class="truncate text-xs text-[var(--sanring-muted-foreground)]">
                            m@example.com
                          </div>
                        </div>
                      </div>
                      <sanring-dropdown-menu-separator />
                      <button type="button" sanringDropdownMenuItem value="upgrade">
                        <svg lucideSparkles class="size-4"></svg>
                        <span>{{ i18n.t('sidebar.demo.upgradeToPro') }}</span>
                      </button>
                      <sanring-dropdown-menu-separator />
                      <button type="button" sanringDropdownMenuItem value="account">
                        <svg lucideBadgeCheck class="size-4"></svg>
                        <span>{{ i18n.t('sidebar.demo.account') }}</span>
                      </button>
                      <button type="button" sanringDropdownMenuItem value="billing">
                        <svg lucideCreditCard class="size-4"></svg>
                        <span>{{ i18n.t('sidebar.demo.billing') }}</span>
                      </button>
                      <button type="button" sanringDropdownMenuItem value="notifications">
                        <svg lucideBell class="size-4"></svg>
                        <span>{{ i18n.t('sidebar.demo.notifications') }}</span>
                      </button>
                      <sanring-dropdown-menu-separator />
                      <button type="button" sanringDropdownMenuItem value="logout">
                        <svg lucideLogOut class="size-4"></svg>
                        <span>{{ i18n.t('sidebar.demo.logOut') }}</span>
                      </button>
                    </sanring-dropdown-menu-content>
                  </sanring-dropdown-menu>
                </sanring-sidebar-footer>
                <button sanringSidebarRail [ariaLabel]="i18n.t('sidebar.demo.toggle')"></button>
              </sanring-sidebar>
              <main sanringSidebarInset class="bg-[var(--docs-surface)] p-6">
                <button
                  type="button"
                  sanringSidebarTrigger
                  class="mb-6 flex size-9 items-center justify-center rounded-[var(--sanring-radius)] hover:bg-[var(--sanring-surface-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sanring-border-strong)]"
                  [attr.aria-label]="i18n.t('sidebar.demo.toggle')"
                >
                  <svg lucidePanelsTopLeft class="size-5"></svg>
                </button>
                <div class="grid gap-4">
                  <div class="h-5 w-44 rounded bg-[var(--docs-border)]"></div>
                  <div class="grid grid-cols-2 gap-3">
                    <div
                      class="h-24 rounded border border-[var(--docs-border)] bg-[var(--docs-bg)]"
                    ></div>
                    <div
                      class="h-24 rounded border border-[var(--docs-border)] bg-[var(--docs-bg)]"
                    ></div>
                  </div>
                  <div
                    class="h-28 rounded border border-[var(--docs-border)] bg-[var(--docs-bg)]"
                  ></div>
                </div>
              </main>
            </div>
            </sanring-sidebar-provider>
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
          componentName="sidebar"
          manualSnippet="import { SANRING_SIDEBAR_IMPORTS } from './components/ui/sidebar';"
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
          <app-component-page-section [section]="section('example-icon')">
            <app-component-page-code-previewer [code]="examples.iconMode" language="angular-html">
              <div previewer class="flex w-full justify-center">
                <sanring-sidebar-provider collapsible="icon" #iconProvider>
                  @let iconIsOpen = iconProvider.isOpen();
                  <div
                    class="flex h-[320px] w-full max-w-[680px] overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]"
                  >
                    <sanring-sidebar class="shrink-0">
                      <sanring-sidebar-header>
                        <button
                          type="button"
                          sanringSidebarTrigger
                          [attr.aria-label]="i18n.t('sidebar.demo.toggle')"
                          class="flex size-8 items-center justify-center rounded-[var(--sanring-radius)] hover:bg-[var(--sanring-surface-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sanring-border-strong)]"
                        >
                          <svg lucideMenu class="size-4"></svg>
                        </button>
                      </sanring-sidebar-header>
                      <sanring-sidebar-content>
                        <sanring-sidebar-menu>
                          <sanring-sidebar-menu-item>
                            <a
                              sanringSidebarMenuButton
                              active
                              href="#"
                              (click)="$event.preventDefault()"
                            >
                              <svg lucideLayoutDashboard class="size-4 shrink-0"></svg>
                              @if (iconIsOpen) {
                                <span class="truncate">{{ i18n.t('sidebar.demo.dashboard') }}</span>
                              }
                            </a>
                          </sanring-sidebar-menu-item>
                          <sanring-sidebar-menu-item>
                            <a sanringSidebarMenuButton href="#" (click)="$event.preventDefault()">
                              <svg lucideSettings class="size-4 shrink-0"></svg>
                              @if (iconIsOpen) {
                                <span class="truncate">{{ i18n.t('sidebar.demo.settings') }}</span>
                              }
                            </a>
                          </sanring-sidebar-menu-item>
                        </sanring-sidebar-menu>
                      </sanring-sidebar-content>
                      <button
                        sanringSidebarRail
                        [ariaLabel]="i18n.t('sidebar.demo.toggle')"
                      ></button>
                    </sanring-sidebar>
                    <main class="min-w-0 flex-1 bg-[var(--docs-surface)] p-6"></main>
                  </div>
                </sanring-sidebar-provider>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-offcanvas')">
            <app-component-page-code-previewer
              [code]="examples.offcanvasMode"
              language="angular-html"
            >
              <div previewer class="grid w-full justify-items-center gap-3">
                <sanring-sidebar-provider collapsible="offcanvas">
                  <button
                    type="button"
                    sanringSidebarTrigger
                    sanringBtn
                    variant="outline"
                    size="sm"
                  >
                    <svg lucideMenu class="size-4"></svg>
                    {{ i18n.t('sidebar.demo.toggle') }}
                  </button>
                  <div
                    class="flex h-[320px] w-full max-w-[680px] overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]"
                  >
                    <sanring-sidebar class="shrink-0">
                      <sanring-sidebar-header>
                        <div class="px-2 text-sm font-semibold">Sanring</div>
                      </sanring-sidebar-header>
                      <sanring-sidebar-content>
                        <sanring-sidebar-menu>
                          <sanring-sidebar-menu-item>
                            <a
                              sanringSidebarMenuButton
                              active
                              href="#"
                              (click)="$event.preventDefault()"
                            >
                              <svg lucideLayoutDashboard class="size-4 shrink-0"></svg>
                              <span>{{ i18n.t('sidebar.demo.dashboard') }}</span>
                            </a>
                          </sanring-sidebar-menu-item>
                          <sanring-sidebar-menu-item>
                            <a sanringSidebarMenuButton href="#" (click)="$event.preventDefault()">
                              <svg lucideUsers class="size-4 shrink-0"></svg>
                              <span>{{ i18n.t('sidebar.demo.customers') }}</span>
                            </a>
                          </sanring-sidebar-menu-item>
                        </sanring-sidebar-menu>
                      </sanring-sidebar-content>
                    </sanring-sidebar>
                    <main class="min-w-0 flex-1 bg-[var(--docs-surface)] p-6"></main>
                  </div>
                </sanring-sidebar-provider>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-none')">
            <app-component-page-code-previewer [code]="examples.noneMode" language="angular-html">
              <div previewer class="flex w-full justify-center">
                <div
                  class="flex h-[320px] w-full max-w-[680px] overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]"
                >
                  <sanring-sidebar collapsible="none" class="shrink-0">
                    <sanring-sidebar-content>
                      <sanring-sidebar-menu>
                        <sanring-sidebar-menu-item>
                          <a
                            sanringSidebarMenuButton
                            active
                            href="#"
                            (click)="$event.preventDefault()"
                          >
                            <svg lucideLayoutDashboard class="size-4 shrink-0"></svg>
                            <span>{{ i18n.t('sidebar.demo.dashboard') }}</span>
                          </a>
                        </sanring-sidebar-menu-item>
                        <sanring-sidebar-menu-item>
                          <a sanringSidebarMenuButton href="#" (click)="$event.preventDefault()">
                            <svg lucideUsers class="size-4 shrink-0"></svg>
                            <span>{{ i18n.t('sidebar.demo.customers') }}</span>
                          </a>
                        </sanring-sidebar-menu-item>
                        <sanring-sidebar-menu-item>
                          <a sanringSidebarMenuButton href="#" (click)="$event.preventDefault()">
                            <svg lucideSettings class="size-4 shrink-0"></svg>
                            <span>{{ i18n.t('sidebar.demo.settings') }}</span>
                          </a>
                        </sanring-sidebar-menu-item>
                      </sanring-sidebar-menu>
                    </sanring-sidebar-content>
                  </sanring-sidebar>
                  <main class="min-w-0 flex-1 bg-[var(--docs-surface)] p-6"></main>
                </div>
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
export class SidebarPageComponent {
  protected readonly page = sidebarPage;
  protected readonly examples = sidebarPageExamples;
  protected readonly i18n = inject(I18nService);
  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }
}

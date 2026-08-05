import {
  ComponentPageApiRow,
  ComponentPageDefinition,
  ComponentPageKeyboardRow,
} from '../../../docs-schema/component-page.types';

export const sidebarPage = {
  componentId: 'sidebar',
  titleKey: 'component.sidebar',
  descriptionKey: 'sidebar.description',
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'sidebar.examples.basic.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'sidebar.usage.description',
      level: 2,
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'sidebar.installation.description',
      level: 2,
    },
    {
      id: 'composition',
      titleKey: 'toc.composition',
      descriptionKey: 'sidebar.composition.description',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      level: 2,
      children: [
        { id: 'example-icon', titleKey: 'sidebar.demo.iconMode', level: 3 },
        { id: 'example-offcanvas', titleKey: 'sidebar.demo.offcanvasMode', level: 3 },
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'sidebar.api.description',
      level: 2,
    },
    {
      id: 'accessibility',
      titleKey: 'toc.accessibility',
      descriptionKey: 'sidebar.accessibility.description',
      level: 2,
    },
    {
      id: 'keyboard',
      titleKey: 'toc.keyboard',
      descriptionKey: 'sidebar.keyboard.description',
      level: 2,
    },
    {
      id: 'stateModel',
      titleKey: 'toc.stateModel',
      descriptionKey: 'sidebar.stateModel.description',
      level: 2,
    },
  ],
  apiRows: [
    {
      property: 'id',
      type: 'string',
      defaultValue: 'auto-generated',
      descriptionKey: 'sidebar.api.id.description',
    },
    {
      property: 'open',
      type: 'boolean',
      defaultValue: 'true',
      descriptionKey: 'sidebar.api.open.description',
    },
    {
      property: 'collapsible',
      type: "'none' | 'offcanvas' | 'icon'",
      defaultValue: "'offcanvas'",
      descriptionKey: 'sidebar.api.collapsible.description',
    },
    {
      property: 'class',
      type: 'string',
      defaultValue: "''",
      descriptionKey: 'sidebar.api.class.description',
    },
    {
      property: 'active',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'sidebar.api.active.description',
    },
    {
      property: 'disabled',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'sidebar.api.disabled.description',
    },
  ] satisfies readonly ComponentPageApiRow[],
  keyboardRows: [
    { keys: 'Tab', descriptionKey: 'sidebar.keyboard.tab' },
    { keys: 'Enter / Space', descriptionKey: 'sidebar.keyboard.enterSpace' },
  ] satisfies readonly ComponentPageKeyboardRow[],
} as const satisfies ComponentPageDefinition;

export const sidebarPageExamples = {
  basic: `<div class="flex min-h-[360px]">
  <sanring-sidebar
    id="workspace-sidebar"
    sanringSidebarTrigger
    collapsible="icon"
    [open]="sidebarOpen()"
    (openChange)="sidebarOpen.set($event)"
  >
  <sanring-sidebar-header>
    <div class="flex min-w-0 items-center gap-3 px-2" [class.justify-center]="!sidebarOpen()">
      <div class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-black text-white">
        <svg lucidePanelsTopLeft class="size-5"></svg>
      </div>
      @if (sidebarOpen()) {
        <div class="min-w-0">
          <div class="truncate text-sm font-semibold">Acme Inc</div>
          <div class="truncate text-xs text-muted-foreground">Enterprise</div>
        </div>
      }
    </div>
  </sanring-sidebar-header>

  <sanring-sidebar-content>
    <sanring-sidebar-group>
      @if (sidebarOpen()) {
        <sanring-sidebar-group-label>Platform</sanring-sidebar-group-label>
      }
      <sanring-sidebar-menu>
        <sanring-sidebar-menu-item>
          <sanring-collapsible [open]="true">
            <button type="button" sanringSidebarMenuButton active sanringCollapsibleTrigger>
              <svg lucideLayoutDashboard class="size-4 shrink-0"></svg>
              @if (sidebarOpen()) {
                <span class="truncate">Dashboard</span>
                <svg lucideChevronRight class="ml-auto size-4 shrink-0"></svg>
              }
            </button>
            @if (sidebarOpen()) {
              <div sanringCollapsibleContent class="ml-4 grid gap-1 border-l py-1 pl-3">
                <a href="#" class="px-2 py-1.5 text-sm">Overview</a>
                <a href="#" class="px-2 py-1.5 text-sm">Reports</a>
              </div>
            }
          </sanring-collapsible>
        </sanring-sidebar-menu-item>

        <sanring-sidebar-menu-item>
          <sanring-collapsible>
            <button type="button" sanringSidebarMenuButton sanringCollapsibleTrigger>
              <svg lucideUsers class="size-4 shrink-0"></svg>
              @if (sidebarOpen()) {
                <span class="truncate">Customers</span>
                <svg lucideChevronRight class="ml-auto size-4 shrink-0"></svg>
              }
            </button>
            @if (sidebarOpen()) {
              <div sanringCollapsibleContent class="ml-4 grid gap-1 border-l py-1 pl-3">
                <a href="#" class="px-2 py-1.5 text-sm">Accounts</a>
                <a href="#" class="px-2 py-1.5 text-sm">Segments</a>
              </div>
            }
          </sanring-collapsible>
        </sanring-sidebar-menu-item>

        <sanring-sidebar-menu-item>
          <sanring-collapsible>
            <button type="button" sanringSidebarMenuButton sanringCollapsibleTrigger>
              <svg lucideBell class="size-4 shrink-0"></svg>
              @if (sidebarOpen()) {
                <span class="truncate">Notifications</span>
                <svg lucideChevronRight class="ml-auto size-4 shrink-0"></svg>
              }
            </button>
            @if (sidebarOpen()) {
              <div sanringCollapsibleContent class="ml-4 grid gap-1 border-l py-1 pl-3">
                <a href="#" class="px-2 py-1.5 text-sm">Inbox</a>
                <a href="#" class="px-2 py-1.5 text-sm">Rules</a>
              </div>
            }
          </sanring-collapsible>
        </sanring-sidebar-menu-item>
      </sanring-sidebar-menu>
    </sanring-sidebar-group>
  </sanring-sidebar-content>

  <sanring-sidebar-footer>
    <button type="button" sanringSidebarMenuButton>
      <svg lucideSettings class="size-4 shrink-0"></svg>
      @if (sidebarOpen()) {
        <span class="truncate">Settings</span>
      }
    </button>
  </sanring-sidebar-footer>
</sanring-sidebar>

<main class="flex-1 p-6">
  <button
    type="button"
    aria-controls="workspace-sidebar"
    [attr.aria-expanded]="sidebarOpen()"
    (click)="sidebarOpen.set(!sidebarOpen())"
  >
    <svg lucidePanelsTopLeft class="size-5"></svg>
  </button>
</main>
</div>`,
  usageImport: `import { Component } from '@angular/core';
import { SANRING_COLLAPSIBLE_IMPORTS } from './components/ui/collapsible';
import { SANRING_SIDEBAR_IMPORTS } from './components/ui/sidebar';

@Component({
  imports: [SANRING_COLLAPSIBLE_IMPORTS, SANRING_SIDEBAR_IMPORTS],
})
export class ExampleComponent {}`,
  usageMain: `<sanring-sidebar collapsible="icon">
  <sanring-sidebar-header>
    <button type="button" sanringSidebarTrigger>Toggle</button>
  </sanring-sidebar-header>

  <sanring-sidebar-content>
    <sanring-sidebar-group>
      <sanring-sidebar-group-label>Navigation</sanring-sidebar-group-label>
      <sanring-sidebar-menu>
        <sanring-sidebar-menu-item>
          <a sanringSidebarMenuButton active href="#">Dashboard</a>
        </sanring-sidebar-menu-item>
        <sanring-sidebar-menu-item>
          <a sanringSidebarMenuButton href="#">Settings</a>
        </sanring-sidebar-menu-item>
      </sanring-sidebar-menu>
    </sanring-sidebar-group>
  </sanring-sidebar-content>
</sanring-sidebar>`,
  usageIndividualImports: `import { Component } from '@angular/core';
import { CollapsibleComponent, CollapsibleContentDirective, CollapsibleTriggerDirective } from './components/ui/collapsible';
import { SidebarComponent, SidebarContentComponent, SidebarFooterComponent, SidebarGroupComponent, SidebarGroupLabelComponent, SidebarHeaderComponent, SidebarMenuButtonDirective, SidebarMenuComponent, SidebarMenuItemComponent, SidebarTriggerDirective } from './components/ui/sidebar';

@Component({
  imports: [
    CollapsibleComponent,
    CollapsibleTriggerDirective,
    CollapsibleContentDirective,
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
  ],
})
export class ExampleComponent {}`,
  composition: `sanring-sidebar
├── sanring-sidebar-header
│   └── [sanringSidebarTrigger]
├── sanring-sidebar-content
│   └── sanring-sidebar-group
│       ├── sanring-sidebar-group-label
│       └── sanring-sidebar-menu
│           └── sanring-sidebar-menu-item
│               └── [sanringSidebarMenuButton]
└── sanring-sidebar-footer`,
  iconMode: `<sanring-sidebar collapsible="icon">
  <sanring-sidebar-header>
    <button type="button" sanringSidebarTrigger aria-label="Toggle sidebar">SR</button>
  </sanring-sidebar-header>
  <sanring-sidebar-content>
    ...
  </sanring-sidebar-content>
</sanring-sidebar>`,
  offcanvasMode: `<button type="button" (click)="sidebarOpen.set(!sidebarOpen())">
  Toggle sidebar
</button>

<div class="flex min-h-[320px]">
  <sanring-sidebar
    collapsible="offcanvas"
    [open]="sidebarOpen()"
    (openChange)="sidebarOpen.set($event)"
  >
    ...
  </sanring-sidebar>
  <main class="flex-1">Content</main>
</div>`,
} as const;

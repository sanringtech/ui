import {
  ComponentPageApiRow,
  ComponentPageDefinition,
  ComponentPageKeyboardRow,
} from '../../../docs-schema/component-page.types';

export const sidebarPage = {
  componentId: 'sidebar',
  titleKey: 'component.sidebar',
  descriptionKey: 'sidebar.description',
  registryDeps: ['utils'],
  ssrSafe: true,
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
        { id: 'example-none', titleKey: 'sidebar.demo.noneMode', level: 3 },
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
  basic: `<sanring-sidebar-provider collapsible="icon" #provider>
  @let isOpen = provider.isOpen();
  <div class="flex min-h-[620px]">
  <sanring-sidebar>
  <sanring-sidebar-header>
    <sanring-dropdown-menu>
      <button type="button" sanringDropdownMenuTrigger [menu]="teamMenu.menu" side="right">
        <svg lucideGalleryVerticalEnd class="size-5"></svg>
        @if (isOpen) {
          <span class="min-w-0 text-left">
            <span class="block truncate text-sm font-semibold">Acme Inc</span>
            <span class="block truncate text-xs text-muted-foreground">Enterprise</span>
          </span>
          <svg lucideChevronsUpDown class="ml-auto size-4"></svg>
        }
      </button>
      <sanring-dropdown-menu-content #teamMenu="sanringDropdownMenuContent" class="w-64">
        <sanring-dropdown-menu-label>Teams</sanring-dropdown-menu-label>
        <button type="button" sanringDropdownMenuItem value="acme">Acme Inc</button>
        <button type="button" sanringDropdownMenuItem value="acme-corp">Acme Corp.</button>
        <button type="button" sanringDropdownMenuItem value="evil-corp">Evil Corp.</button>
        <sanring-dropdown-menu-separator />
        <button type="button" sanringDropdownMenuItem value="add-team">Add team</button>
      </sanring-dropdown-menu-content>
    </sanring-dropdown-menu>
  </sanring-sidebar-header>

  <sanring-sidebar-content>
    <sanring-sidebar-group>
      @if (isOpen) {
        <sanring-sidebar-group-label>Platform</sanring-sidebar-group-label>
      }
      <sanring-sidebar-group-content>
        <sanring-sidebar-menu>
          <sanring-sidebar-menu-item>
            <sanring-collapsible [open]="true">
              <button type="button" sanringSidebarMenuButton active sanringCollapsibleTrigger>
                <svg lucideLayoutDashboard class="size-4 shrink-0"></svg>
                @if (isOpen) {
                  <span class="truncate">Dashboard</span>
                  <svg lucideChevronRight class="ml-auto size-4 shrink-0"></svg>
                }
              </button>
              @if (isOpen) {
                <sanring-sidebar-menu-sub sanringCollapsibleContent>
                  <sanring-sidebar-menu-sub-item>
                    <a href="#" class="block rounded-md px-2 py-1.5 text-sm hover:bg-muted">Overview</a>
                  </sanring-sidebar-menu-sub-item>
                  <sanring-sidebar-menu-sub-item>
                    <a href="#" class="block px-2 py-1.5 text-sm">Reports</a>
                  </sanring-sidebar-menu-sub-item>
                </sanring-sidebar-menu-sub>
              }
            </sanring-collapsible>
          </sanring-sidebar-menu-item>

          <sanring-sidebar-menu-item>
            <sanring-collapsible>
              <button type="button" sanringSidebarMenuButton sanringCollapsibleTrigger>
                <svg lucideUsers class="size-4 shrink-0"></svg>
                @if (isOpen) {
                  <span class="truncate">Customers</span>
                  <svg lucideChevronRight class="ml-auto size-4 shrink-0"></svg>
                }
              </button>
              @if (isOpen) {
                <sanring-sidebar-menu-sub sanringCollapsibleContent>
                  <sanring-sidebar-menu-sub-item>
                    <a href="#" class="block px-2 py-1.5 text-sm">Accounts</a>
                  </sanring-sidebar-menu-sub-item>
                  <sanring-sidebar-menu-sub-item>
                    <a href="#" class="block px-2 py-1.5 text-sm">Segments</a>
                  </sanring-sidebar-menu-sub-item>
                </sanring-sidebar-menu-sub>
              }
            </sanring-collapsible>
          </sanring-sidebar-menu-item>

          <sanring-sidebar-menu-item>
            <sanring-collapsible>
              <button type="button" sanringSidebarMenuButton sanringCollapsibleTrigger>
                <svg lucideBell class="size-4 shrink-0"></svg>
                @if (isOpen) {
                  <span class="truncate">Notifications</span>
                  <svg lucideChevronRight class="ml-auto size-4 shrink-0"></svg>
                }
              </button>
              @if (isOpen) {
                <sanring-sidebar-menu-sub sanringCollapsibleContent>
                  <sanring-sidebar-menu-sub-item>
                    <a href="#" class="block px-2 py-1.5 text-sm">Inbox</a>
                  </sanring-sidebar-menu-sub-item>
                  <sanring-sidebar-menu-sub-item>
                    <a href="#" class="block px-2 py-1.5 text-sm">Rules</a>
                  </sanring-sidebar-menu-sub-item>
                </sanring-sidebar-menu-sub>
              }
            </sanring-collapsible>
          </sanring-sidebar-menu-item>
        </sanring-sidebar-menu>
      </sanring-sidebar-group-content>
    </sanring-sidebar-group>

    @if (isOpen) {
      <sanring-sidebar-group>
        <sanring-sidebar-group-label>Projects</sanring-sidebar-group-label>
        <sanring-sidebar-group-content>
          <sanring-sidebar-menu>
            <sanring-sidebar-menu-item>
              <a href="#" sanringSidebarMenuButton>
                <svg lucideFrame class="size-4 shrink-0"></svg>
                <span>Design Engineering</span>
              </a>
              <sanring-dropdown-menu>
                <button
                  type="button"
                  sanringSidebarMenuAction
                  sanringDropdownMenuTrigger
                  [menu]="projectMenu.menu"
                  side="right"
                  aria-label="Project actions"
                >
                  <svg lucideEllipsis class="size-4"></svg>
                </button>
                <sanring-dropdown-menu-content #projectMenu="sanringDropdownMenuContent" class="w-48">
                  <button type="button" sanringDropdownMenuItem value="view-project">View Project</button>
                  <button type="button" sanringDropdownMenuItem value="share-project">Share Project</button>
                  <sanring-dropdown-menu-separator />
                  <button type="button" sanringDropdownMenuItem value="delete-project" variant="destructive">
                    Delete Project
                  </button>
                </sanring-dropdown-menu-content>
              </sanring-dropdown-menu>
            </sanring-sidebar-menu-item>
            <sanring-sidebar-menu-item>
              <a href="#" sanringSidebarMenuButton>
                <svg lucideChartPie class="size-4 shrink-0"></svg>
                <span>Sales & Marketing</span>
              </a>
            </sanring-sidebar-menu-item>
            <sanring-sidebar-menu-item>
              <a href="#" sanringSidebarMenuButton>
                <svg lucideMap class="size-4 shrink-0"></svg>
                <span>Travel</span>
              </a>
            </sanring-sidebar-menu-item>
          </sanring-sidebar-menu>
        </sanring-sidebar-group-content>
      </sanring-sidebar-group>
    }
  </sanring-sidebar-content>

  <sanring-sidebar-footer>
    <sanring-dropdown-menu>
      <button type="button" sanringDropdownMenuTrigger [menu]="accountMenu.menu" side="right" align="end">
        <img src="https://i.pravatar.cc/80?img=5" alt="" class="size-9 rounded-full" />
        @if (isOpen) {
          <span class="min-w-0 flex-1 text-left">
            <span class="block truncate text-sm font-medium">shadcn</span>
            <span class="block truncate text-xs text-muted-foreground">m@example.com</span>
          </span>
          <svg lucideChevronsUpDown class="size-4"></svg>
        }
      </button>
      <sanring-dropdown-menu-content #accountMenu="sanringDropdownMenuContent" class="w-64">
        <button type="button" sanringDropdownMenuItem value="upgrade">Upgrade to Pro</button>
        <sanring-dropdown-menu-separator />
        <button type="button" sanringDropdownMenuItem value="account">Account</button>
        <button type="button" sanringDropdownMenuItem value="billing">Billing</button>
        <button type="button" sanringDropdownMenuItem value="notifications">Notifications</button>
        <sanring-dropdown-menu-separator />
        <button type="button" sanringDropdownMenuItem value="logout">Log out</button>
      </sanring-dropdown-menu-content>
    </sanring-dropdown-menu>
  </sanring-sidebar-footer>
  <button sanringSidebarRail aria-label="Toggle sidebar"></button>
</sanring-sidebar>

<main sanringSidebarInset class="p-6">
  <button type="button" sanringSidebarTrigger aria-label="Toggle sidebar">
    <svg lucidePanelsTopLeft class="size-5"></svg>
  </button>
</main>
</div>
</sanring-sidebar-provider>`,
  usageImport: `import { Component } from '@angular/core';
import { SANRING_COLLAPSIBLE_IMPORTS } from './components/ui/collapsible';
import { SANRING_DROPDOWN_MENU_IMPORTS } from './components/ui/dropdown-menu';
import { SANRING_SIDEBAR_IMPORTS } from './components/ui/sidebar';

@Component({
  imports: [SANRING_COLLAPSIBLE_IMPORTS, SANRING_DROPDOWN_MENU_IMPORTS, SANRING_SIDEBAR_IMPORTS],
})
export class ExampleComponent {}`,
  usageMain: `<sanring-sidebar collapsible="icon">
  <sanring-sidebar-header>
    <button type="button" sanringSidebarTrigger>Toggle</button>
  </sanring-sidebar-header>

  <sanring-sidebar-content>
    <sanring-sidebar-group>
      <sanring-sidebar-group-label>Navigation</sanring-sidebar-group-label>
      <sanring-sidebar-group-content>
        <sanring-sidebar-menu>
          <sanring-sidebar-menu-item>
            <a sanringSidebarMenuButton active href="#">Dashboard</a>
            <sanring-sidebar-menu-badge>12</sanring-sidebar-menu-badge>
          </sanring-sidebar-menu-item>
          <sanring-sidebar-menu-item>
            <a sanringSidebarMenuButton href="#">Settings</a>
            <button type="button" sanringSidebarMenuAction aria-label="More actions">...</button>
          </sanring-sidebar-menu-item>
        </sanring-sidebar-menu>
      </sanring-sidebar-group-content>
    </sanring-sidebar-group>
  </sanring-sidebar-content>

  <button sanringSidebarRail aria-label="Toggle sidebar"></button>
</sanring-sidebar>`,
  usageIndividualImports: `import { Component } from '@angular/core';
import { CollapsibleComponent, CollapsibleContentDirective, CollapsibleTriggerDirective } from './components/ui/collapsible';
import { DropdownMenuComponent, DropdownMenuContentComponent, DropdownMenuItemDirective, DropdownMenuLabelComponent, DropdownMenuSeparatorComponent, DropdownMenuTriggerDirective } from './components/ui/dropdown-menu';
import { SidebarProviderComponent, SidebarComponent, SidebarContentComponent, SidebarFooterComponent, SidebarGroupComponent, SidebarGroupContentComponent, SidebarGroupLabelComponent, SidebarHeaderComponent, SidebarInsetDirective, SidebarMenuActionDirective, SidebarMenuBadgeComponent, SidebarMenuButtonDirective, SidebarMenuComponent, SidebarMenuItemComponent, SidebarMenuSubComponent, SidebarMenuSubItemComponent, SidebarRailDirective, SidebarTriggerDirective } from './components/ui/sidebar';

@Component({
  imports: [
    CollapsibleComponent,
    CollapsibleTriggerDirective,
    CollapsibleContentDirective,
    DropdownMenuComponent,
    DropdownMenuTriggerDirective,
    DropdownMenuContentComponent,
    DropdownMenuLabelComponent,
    DropdownMenuItemDirective,
    DropdownMenuSeparatorComponent,
    SidebarProviderComponent,
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarContentComponent,
    SidebarFooterComponent,
    SidebarGroupComponent,
    SidebarGroupContentComponent,
    SidebarGroupLabelComponent,
    SidebarMenuComponent,
    SidebarMenuItemComponent,
    SidebarMenuButtonDirective,
    SidebarMenuActionDirective,
    SidebarMenuBadgeComponent,
    SidebarMenuSubComponent,
    SidebarMenuSubItemComponent,
    SidebarRailDirective,
    SidebarInsetDirective,
    SidebarTriggerDirective,
  ],
})
export class ExampleComponent {}`,
  composition: `sanring-sidebar-provider        ← owns open/collapsible state
├── sanring-sidebar
│   ├── sanring-sidebar-header
│   ├── sanring-sidebar-content
│   │   └── sanring-sidebar-group
│   │       ├── sanring-sidebar-group-label
│   │       ├── sanring-sidebar-group-content
│   │       └── sanring-sidebar-menu
│   │           └── sanring-sidebar-menu-item
│   │               ├── [sanringSidebarMenuButton]
│   │               ├── [sanringSidebarMenuAction]
│   │               ├── sanring-sidebar-menu-badge
│   │               └── sanring-sidebar-menu-sub
│   │                   └── sanring-sidebar-menu-sub-item
│   ├── sanring-sidebar-footer
│   └── [sanringSidebarRail]
├── [sanringSidebarInset]
└── [sanringSidebarTrigger]  ← can live anywhere inside the provider`,
  iconMode: `<sanring-sidebar-provider collapsible="icon" #provider>
  @let isOpen = provider.isOpen();
  <div class="flex min-h-[320px]">
    <sanring-sidebar>
      <sanring-sidebar-header>
        <button type="button" sanringSidebarTrigger aria-label="Toggle sidebar">
          <svg lucideMenu class="size-4"></svg>
        </button>
      </sanring-sidebar-header>
      <sanring-sidebar-content>
        <sanring-sidebar-menu>
          <sanring-sidebar-menu-item>
            <a sanringSidebarMenuButton active href="#">
              <svg lucideLayoutDashboard class="size-4 shrink-0"></svg>
              @if (isOpen) { <span class="truncate">Dashboard</span> }
            </a>
          </sanring-sidebar-menu-item>
          <sanring-sidebar-menu-item>
            <a sanringSidebarMenuButton href="#">
              <svg lucideSettings class="size-4 shrink-0"></svg>
              @if (isOpen) { <span class="truncate">Settings</span> }
            </a>
          </sanring-sidebar-menu-item>
        </sanring-sidebar-menu>
      </sanring-sidebar-content>
      <button sanringSidebarRail aria-label="Toggle sidebar"></button>
    </sanring-sidebar>
    <main class="flex-1 p-6">Content</main>
  </div>
</sanring-sidebar-provider>`,
  offcanvasMode: `<sanring-sidebar-provider collapsible="offcanvas">
  <button type="button" sanringSidebarTrigger>Toggle sidebar</button>

  <div class="flex min-h-[320px]">
    <sanring-sidebar>
      ...
    </sanring-sidebar>
    <main class="flex-1">Content</main>
  </div>
</sanring-sidebar-provider>`,
  noneMode: `<sanring-sidebar collapsible="none">
  <sanring-sidebar-content>
    <sanring-sidebar-menu>
      <sanring-sidebar-menu-item>
        <a sanringSidebarMenuButton active href="#">
          <svg lucideLayoutDashboard class="size-4 shrink-0"></svg>
          <span>Dashboard</span>
        </a>
      </sanring-sidebar-menu-item>
      <sanring-sidebar-menu-item>
        <a sanringSidebarMenuButton href="#">
          <svg lucideUsers class="size-4 shrink-0"></svg>
          <span>Customers</span>
        </a>
      </sanring-sidebar-menu-item>
      <sanring-sidebar-menu-item>
        <a sanringSidebarMenuButton href="#">
          <svg lucideSettings class="size-4 shrink-0"></svg>
          <span>Settings</span>
        </a>
      </sanring-sidebar-menu-item>
    </sanring-sidebar-menu>
  </sanring-sidebar-content>
</sanring-sidebar>`,
} as const;

import {
  ComponentPageApiRow,
  ComponentPageDefinition,
} from '../../../docs-schema/component-page.types';

export const dropdownMenuPage = {
  componentId: 'dropdown-menu',
  titleKey: 'component.dropdownMenu',
  descriptionKey: 'dropdownMenu.description',
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'dropdownMenu.examples.basic.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'dropdownMenu.usage.description',
      level: 2,
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'dropdownMenu.installation.description',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      descriptionKey: 'dropdownMenu.examples.description',
      level: 2,
      children: [
        {
          id: 'example-checkbox',
          titleKey: 'dropdownMenu.demo.checkbox',
          level: 3,
        },
        {
          id: 'example-radio',
          titleKey: 'dropdownMenu.demo.radio',
          level: 3,
        },
        {
          id: 'example-submenu',
          titleKey: 'dropdownMenu.demo.submenu',
          level: 3,
        },
        {
          id: 'example-with-icons',
          titleKey: 'dropdownMenu.demo.withIcons',
          level: 3,
        },
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'dropdownMenu.api.description',
      level: 2,
    },
  ],
  apiRows: [
    {
      property: 'DropdownMenuTriggerDirective.sanringDropdownMenuTrigger',
      type: 'TemplateRef<DropdownMenuContext<T>>',
      defaultValue: 'required',
      descriptionKey: 'dropdownMenu.api.trigger.description',
    },
    {
      property: 'DropdownMenuTriggerDirective.sanringDropdownMenuData',
      type: 'T | undefined',
      defaultValue: 'undefined',
      descriptionKey: 'dropdownMenu.api.triggerData.description',
    },
    {
      property: 'DropdownMenuTriggerDirective.isOpen',
      type: 'Signal<boolean>',
      defaultValue: 'false',
      descriptionKey: 'dropdownMenu.api.isOpen.description',
    },
    {
      property: 'DropdownMenuContentComponent.state',
      type: "'open' | 'closed'",
      defaultValue: "'open'",
      descriptionKey: 'dropdownMenu.api.state.description',
    },
    {
      property: 'DropdownMenuItemDirective.disabled',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'dropdownMenu.api.disabled.description',
    },
    {
      property: 'DropdownMenuItemDirective.variant',
      type: "'default' | 'destructive'",
      defaultValue: "'default'",
      descriptionKey: 'dropdownMenu.api.variant.description',
    },
    {
      property: 'DropdownMenuItemDirective.selected',
      type: 'Output<void>',
      defaultValue: '-',
      descriptionKey: 'dropdownMenu.api.selected.description',
    },
    {
      property: 'class',
      type: 'string',
      defaultValue: 'undefined',
      descriptionKey: 'dropdownMenu.api.class.description',
    },
  ] satisfies readonly ComponentPageApiRow[],
} as const satisfies ComponentPageDefinition;

export const dropdownMenuPageExamples = {
  basic: `<sanring-dropdown-menu>
  <button sanringBtn variant="outline" [sanringDropdownMenuTrigger]="menu">
    Open
  </button>

  <ng-template #menu let-close="close">
    <sanring-dropdown-menu-content class="w-56">
      <sanring-dropdown-menu-label>Actions</sanring-dropdown-menu-label>
      <button sanringDropdownMenuItem type="button" (selected)="close()">New tab</button>
      <button sanringDropdownMenuItem type="button" (selected)="close()">New window</button>
      <sanring-dropdown-menu-separator />
      <button sanringDropdownMenuItem type="button" variant="destructive" (selected)="close()">
        Delete
      </button>
    </sanring-dropdown-menu-content>
  </ng-template>
</sanring-dropdown-menu>`,
  usageImport: `import { ButtonDirective, SANRING_DROPDOWN_MENU_IMPORTS } from '@sanring/ui';`,
  usageMain: `<sanring-dropdown-menu>
  <button sanringBtn [sanringDropdownMenuTrigger]="menu">Open menu</button>

  <ng-template #menu let-close="close">
    <sanring-dropdown-menu-content>
      <button sanringDropdownMenuItem type="button" (selected)="close()">Profile</button>
      <button sanringDropdownMenuItem type="button" (selected)="close()">Settings</button>
    </sanring-dropdown-menu-content>
  </ng-template>
</sanring-dropdown-menu>`,
  checkbox: `<sanring-dropdown-menu>
  <button sanringBtn variant="outline" [sanringDropdownMenuTrigger]="viewMenu">
    View
  </button>

  <ng-template #viewMenu let-close="close">
    <sanring-dropdown-menu-content class="w-56">
      <sanring-dropdown-menu-label>Panels</sanring-dropdown-menu-label>
      <button sanringDropdownMenuItem type="button" (selected)="showStatusBar = !showStatusBar">
        <span class="flex size-4 items-center justify-center">
          @if (showStatusBar) {
            <svg lucideCheck class="size-4"></svg>
          }
        </span>
        <span>Status bar</span>
      </button>
      <button sanringDropdownMenuItem type="button" (selected)="showActivityBar = !showActivityBar">
        <span class="flex size-4 items-center justify-center">
          @if (showActivityBar) {
            <svg lucideCheck class="size-4"></svg>
          }
        </span>
        <span>Activity bar</span>
      </button>
      <sanring-dropdown-menu-separator />
      <button sanringDropdownMenuItem type="button" (selected)="close()">Reset layout</button>
    </sanring-dropdown-menu-content>
  </ng-template>
</sanring-dropdown-menu>`,
  radio: `<sanring-dropdown-menu>
  <button sanringBtn variant="outline" [sanringDropdownMenuTrigger]="densityMenu">
    Density
  </button>

  <ng-template #densityMenu let-close="close">
    <sanring-dropdown-menu-content class="w-56">
      <sanring-dropdown-menu-label>Density</sanring-dropdown-menu-label>
      <button sanringDropdownMenuItem type="button" (selected)="density = 'compact'; close()">
        <span class="flex size-4 items-center justify-center">
          @if (density === 'compact') {
            <svg lucideCircle class="size-2 fill-current"></svg>
          }
        </span>
        <span>Compact</span>
      </button>
      <button sanringDropdownMenuItem type="button" (selected)="density = 'comfortable'; close()">
        <span class="flex size-4 items-center justify-center">
          @if (density === 'comfortable') {
            <svg lucideCircle class="size-2 fill-current"></svg>
          }
        </span>
        <span>Comfortable</span>
      </button>
    </sanring-dropdown-menu-content>
  </ng-template>
</sanring-dropdown-menu>`,
  submenu: `<sanring-dropdown-menu>
  <button sanringBtn variant="outline" [sanringDropdownMenuTrigger]="fileMenu">
    File
  </button>

  <ng-template #fileMenu let-close="close">
    <sanring-dropdown-menu-content class="grid w-[420px] grid-cols-[180px_1fr] gap-1">
      <div>
        <sanring-dropdown-menu-label>File</sanring-dropdown-menu-label>
        <button sanringDropdownMenuItem type="button" (mouseenter)="submenu = 'share'" (selected)="submenu = 'share'">
          <span class="flex-1 text-left">Share</span>
          <svg lucideChevronRight class="size-4"></svg>
        </button>
        <button sanringDropdownMenuItem type="button" (mouseenter)="submenu = 'export'" (selected)="submenu = 'export'">
          <span class="flex-1 text-left">Export</span>
          <svg lucideChevronRight class="size-4"></svg>
        </button>
        <sanring-dropdown-menu-separator />
        <button sanringDropdownMenuItem type="button" (selected)="close()">Close file</button>
      </div>

      <div class="border-l border-[var(--sanring-border)] pl-1">
        <sanring-dropdown-menu-label>
          {{ submenu === 'share' ? 'Share' : 'Export' }}
        </sanring-dropdown-menu-label>
        @if (submenu === 'share') {
          <button sanringDropdownMenuItem type="button" (selected)="close()">Copy link</button>
          <button sanringDropdownMenuItem type="button" (selected)="close()">Invite people</button>
        } @else {
          <button sanringDropdownMenuItem type="button" (selected)="close()">PDF</button>
          <button sanringDropdownMenuItem type="button" (selected)="close()">Markdown</button>
        }
      </div>
    </sanring-dropdown-menu-content>
  </ng-template>
</sanring-dropdown-menu>`,
  withIcons: `<sanring-dropdown-menu>
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
</sanring-dropdown-menu>`,
} as const;

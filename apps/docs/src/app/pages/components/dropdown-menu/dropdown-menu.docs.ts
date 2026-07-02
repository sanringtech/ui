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
      property: 'DropdownMenuTriggerDirective.menu',
      type: 'Menu | undefined',
      defaultValue: 'required',
      descriptionKey: 'dropdownMenu.api.menu.description',
    },
    {
      property: 'DropdownMenuContentComponent.itemSelected',
      type: 'Output<unknown>',
      defaultValue: '-',
      descriptionKey: 'dropdownMenu.api.itemSelected.description',
    },
    {
      property: 'DropdownMenuItemDirective.value',
      type: 'unknown',
      defaultValue: 'required',
      descriptionKey: 'dropdownMenu.api.value.description',
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
      property: 'class',
      type: 'string',
      defaultValue: 'undefined',
      descriptionKey: 'dropdownMenu.api.class.description',
    },
  ] satisfies readonly ComponentPageApiRow[],
} as const satisfies ComponentPageDefinition;

export const dropdownMenuPageExamples = {
  basic: `<sanring-dropdown-menu>
  <button sanringBtn variant="outline" sanringDropdownMenuTrigger [menu]="menu.menu">
    Open
  </button>

  <sanring-dropdown-menu-content #menu="sanringDropdownMenuContent" class="w-56">
    <sanring-dropdown-menu-label>Actions</sanring-dropdown-menu-label>
    <button sanringDropdownMenuItem type="button" value="new-tab">New tab</button>
    <button sanringDropdownMenuItem type="button" value="new-window">New window</button>
    <sanring-dropdown-menu-separator />
    <button sanringDropdownMenuItem type="button" value="delete" variant="destructive">
      Delete
    </button>
  </sanring-dropdown-menu-content>
</sanring-dropdown-menu>`,
  usageImport: `import { ButtonDirective, SANRING_DROPDOWN_MENU_IMPORTS } from '@sanring/ui';`,
  usageMain: `<sanring-dropdown-menu>
  <button sanringBtn sanringDropdownMenuTrigger [menu]="menu.menu">Open menu</button>

  <sanring-dropdown-menu-content #menu="sanringDropdownMenuContent" (itemSelected)="onAction($event)">
    <button sanringDropdownMenuItem type="button" value="profile">Profile</button>
    <button sanringDropdownMenuItem type="button" value="settings">Settings</button>
  </sanring-dropdown-menu-content>
</sanring-dropdown-menu>`,
  checkbox: `<sanring-dropdown-menu>
  <button sanringBtn variant="outline" sanringDropdownMenuTrigger [menu]="viewMenu.menu">
    View
  </button>

  <sanring-dropdown-menu-content
    #viewMenu="sanringDropdownMenuContent"
    class="w-56"
    (itemSelected)="onViewAction($event)"
  >
    <sanring-dropdown-menu-label>Panels</sanring-dropdown-menu-label>
    <button sanringDropdownMenuItem type="button" value="status-bar">
      <span class="flex size-4 items-center justify-center">
        @if (showStatusBar) {
          <svg lucideCheck class="size-4"></svg>
        }
      </span>
      <span>Status bar</span>
    </button>
    <button sanringDropdownMenuItem type="button" value="activity-bar">
      <span class="flex size-4 items-center justify-center">
        @if (showActivityBar) {
          <svg lucideCheck class="size-4"></svg>
        }
      </span>
      <span>Activity bar</span>
    </button>
    <sanring-dropdown-menu-separator />
    <button sanringDropdownMenuItem type="button" value="reset">Reset layout</button>
  </sanring-dropdown-menu-content>
</sanring-dropdown-menu>`,
  radio: `<sanring-dropdown-menu>
  <button sanringBtn variant="outline" sanringDropdownMenuTrigger [menu]="densityMenu.menu">
    Density
  </button>

  <sanring-dropdown-menu-content
    #densityMenu="sanringDropdownMenuContent"
    class="w-56"
    (itemSelected)="onDensityAction($event)"
  >
    <sanring-dropdown-menu-label>Density</sanring-dropdown-menu-label>
    <button sanringDropdownMenuItem type="button" value="compact">
      <span class="flex size-4 items-center justify-center">
        @if (density === 'compact') {
          <svg lucideCircle class="size-2 fill-current"></svg>
        }
      </span>
      <span>Compact</span>
    </button>
    <button sanringDropdownMenuItem type="button" value="comfortable">
      <span class="flex size-4 items-center justify-center">
        @if (density === 'comfortable') {
          <svg lucideCircle class="size-2 fill-current"></svg>
        }
      </span>
      <span>Comfortable</span>
    </button>
  </sanring-dropdown-menu-content>
</sanring-dropdown-menu>`,
  submenu: `<sanring-dropdown-menu>
  <button sanringBtn variant="outline" sanringDropdownMenuTrigger [menu]="fileMenu.menu">
    File
  </button>

  <sanring-dropdown-menu-content
    #fileMenu="sanringDropdownMenuContent"
    class="grid w-[420px] grid-cols-[180px_1fr] gap-1"
    (itemSelected)="onFileAction($event)"
  >
    <div>
      <sanring-dropdown-menu-label>File</sanring-dropdown-menu-label>
      <button sanringDropdownMenuItem type="button" value="share" (mouseenter)="submenu = 'share'">
        <span class="flex-1 text-left">Share</span>
        <svg lucideChevronRight class="size-4"></svg>
      </button>
      <button sanringDropdownMenuItem type="button" value="export" (mouseenter)="submenu = 'export'">
        <span class="flex-1 text-left">Export</span>
        <svg lucideChevronRight class="size-4"></svg>
      </button>
      <sanring-dropdown-menu-separator />
      <button sanringDropdownMenuItem type="button" value="close-file">Close file</button>
    </div>

    <div class="border-l border-[var(--sanring-border)] pl-1">
      <sanring-dropdown-menu-label>
        {{ submenu === 'share' ? 'Share' : 'Export' }}
      </sanring-dropdown-menu-label>
      @if (submenu === 'share') {
        <button sanringDropdownMenuItem type="button" value="copy-link">Copy link</button>
        <button sanringDropdownMenuItem type="button" value="invite-people">Invite people</button>
      } @else {
        <button sanringDropdownMenuItem type="button" value="export-pdf">PDF</button>
        <button sanringDropdownMenuItem type="button" value="export-markdown">Markdown</button>
      }
    </div>
  </sanring-dropdown-menu-content>
</sanring-dropdown-menu>`,
  withIcons: `<sanring-dropdown-menu>
  <button sanringBtn variant="outline" sanringDropdownMenuTrigger [menu]="moreMenu.menu">
    <svg lucideEllipsis class="size-4"></svg>
    More
  </button>

  <sanring-dropdown-menu-content #moreMenu="sanringDropdownMenuContent" class="w-56">
    <button sanringDropdownMenuItem type="button" value="new-file">
      <svg lucideFile class="size-4"></svg>
      <span>New file</span>
    </button>
    <button sanringDropdownMenuItem type="button" value="new-folder">
      <svg lucideFolder class="size-4"></svg>
      <span>New folder</span>
    </button>
    <sanring-dropdown-menu-separator />
    <button sanringDropdownMenuItem type="button" value="preferences">
      <svg lucideSettings class="size-4"></svg>
      <span>Preferences</span>
    </button>
  </sanring-dropdown-menu-content>
</sanring-dropdown-menu>`,
} as const;

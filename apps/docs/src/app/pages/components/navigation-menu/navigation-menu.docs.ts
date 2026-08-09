import {
  ComponentPageApiRow,
  ComponentPageDefinition,
  ComponentPageKeyboardRow,
} from '../../../docs-schema/component-page.types';

export const navigationMenuPage = {
  componentId: 'navigation-menu',
  titleKey: 'component.navigationMenu',
  descriptionKey: 'navigationMenu.description',
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'navigationMenu.examples.basic.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'navigationMenu.usage.description',
      level: 2,
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'navigationMenu.installation.description',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      level: 2,
      children: [
        {
          id: 'example-viewport',
          titleKey: 'navigationMenu.demo.viewport',
          descriptionKey: 'navigationMenu.examples.viewport.description',
          level: 3,
        },
        {
          id: 'example-submenu',
          titleKey: 'navigationMenu.demo.submenu',
          descriptionKey: 'navigationMenu.examples.submenu.description',
          level: 3,
        },
        {
          id: 'example-vertical',
          titleKey: 'navigationMenu.demo.vertical',
          descriptionKey: 'navigationMenu.examples.vertical.description',
          level: 3,
        },
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'navigationMenu.api.description',
      level: 2,
    },
    {
      id: 'accessibility',
      titleKey: 'toc.accessibility',
      descriptionKey: 'navigationMenu.accessibility.description',
      level: 2,
    },
    {
      id: 'keyboard',
      titleKey: 'toc.keyboard',
      descriptionKey: 'navigationMenu.keyboard.description',
      level: 2,
    },
    {
      id: 'stateModel',
      titleKey: 'toc.stateModel',
      descriptionKey: 'navigationMenu.stateModel.description',
      level: 2,
    },
  ],
  apiRows: [
    {
      property: 'NavigationMenuComponent.orientation',
      type: "'horizontal' | 'vertical'",
      defaultValue: "'horizontal'",
      descriptionKey: 'navigationMenu.api.orientation.description',
    },
    {
      property: 'NavigationMenuComponent.value',
      type: 'Model<string | null>',
      defaultValue: 'null',
      descriptionKey: 'navigationMenu.api.value.description',
    },
    {
      property: 'NavigationMenuComponent.delayDuration',
      type: 'number',
      defaultValue: '200',
      descriptionKey: 'navigationMenu.api.delayDuration.description',
    },
    {
      property: 'NavigationMenuComponent.skipDelayDuration',
      type: 'number',
      defaultValue: '300',
      descriptionKey: 'navigationMenu.api.skipDelayDuration.description',
    },
    {
      property: 'NavigationMenuComponent.ariaLabel / ariaLabelledBy',
      type: 'string | undefined',
      defaultValue: 'undefined',
      descriptionKey: 'navigationMenu.api.ariaLabel.description',
    },
    {
      property: 'NavigationMenuItemComponent.value',
      type: 'string | undefined',
      defaultValue: 'generated',
      descriptionKey: 'navigationMenu.api.itemValue.description',
    },
    {
      property: 'NavigationMenuItemComponent.disabled',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'navigationMenu.api.itemDisabled.description',
    },
    {
      property: 'NavigationMenuContentComponent.id',
      type: 'string | undefined',
      defaultValue: 'generated',
      descriptionKey: 'navigationMenu.api.contentId.description',
    },
    {
      property: 'NavigationMenuSubComponent.open',
      type: 'Model<boolean>',
      defaultValue: 'false',
      descriptionKey: 'navigationMenu.api.subOpen.description',
    },
    {
      property: 'NavigationMenuSubTriggerComponent.disabled',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'navigationMenu.api.subTriggerDisabled.description',
    },
    {
      property: 'NavigationMenuLinkDirective.active',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'navigationMenu.api.linkActive.description',
    },
    {
      property: 'NavigationMenuLinkDirective.disabled',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'navigationMenu.api.linkDisabled.description',
    },
    {
      property: 'NavigationMenuLinkDirective.target / rel',
      type: "'_blank' | '_self' | '_parent' | '_top' | undefined",
      defaultValue: 'undefined',
      descriptionKey: 'navigationMenu.api.linkTarget.description',
    },
    {
      property: 'NavigationMenuSeparatorComponent.vertical',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'navigationMenu.api.separatorVertical.description',
    },
    {
      property: 'class',
      type: 'string',
      defaultValue: 'undefined',
      descriptionKey: 'navigationMenu.api.class.description',
    },
  ] satisfies readonly ComponentPageApiRow[],
  keyboardRows: [
    { keys: 'Enter / Space', descriptionKey: 'navigationMenu.keyboard.toggle' },
    { keys: '↓ (Arrow Down) / ↑ (Arrow Up)', descriptionKey: 'navigationMenu.keyboard.open' },
    { keys: '→ (Arrow Right)', descriptionKey: 'navigationMenu.keyboard.subOpen' },
    { keys: '← (Arrow Left)', descriptionKey: 'navigationMenu.keyboard.subClose' },
    { keys: 'Escape', descriptionKey: 'navigationMenu.keyboard.close' },
  ] satisfies readonly ComponentPageKeyboardRow[],
} as const satisfies ComponentPageDefinition;

export const navigationMenuPageExamples = {
  basic: `<div class="flex min-h-16 items-center gap-3 border-b px-4">
  <div class="flex size-9 items-center justify-center rounded-[var(--sanring-radius)]">
    <svg lucideSparkles class="size-4"></svg>
  </div>

  <sanring-navigation-menu ariaLabel="Sanring product navigation">
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
              class="min-h-44 flex-col justify-end p-4"
              (click)="$event.preventDefault()"
            >
              <svg lucideRocket class="size-6"></svg>
              <div>
                <sanring-navigation-menu-label>Sanring UI</sanring-navigation-menu-label>
                <p sanringNavigationMenuDescription>
                  Headless Angular primitives with predictable styling hooks.
                </p>
              </div>
            </a>

            <div class="grid gap-1">
              <a sanringNavigationMenuLink href="#" (click)="$event.preventDefault()">
                <svg lucideBox class="mt-0.5 size-4 shrink-0"></svg>
                <div>
                  <sanring-navigation-menu-label>Components</sanring-navigation-menu-label>
                  <p sanringNavigationMenuDescription>
                    Dialogs, forms, overlays, display blocks, and navigation.
                  </p>
                </div>
              </a>
              <a sanringNavigationMenuLink href="#" (click)="$event.preventDefault()">
                <svg lucidePalette class="mt-0.5 size-4 shrink-0"></svg>
                <div>
                  <sanring-navigation-menu-label>Theming</sanring-navigation-menu-label>
                  <p sanringNavigationMenuDescription>
                    Customize the --sanring-* token layer once.
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
          <a sanringNavigationMenuLink href="#" (click)="$event.preventDefault()">Guides</a>
          <a sanringNavigationMenuLink href="#" (click)="$event.preventDefault()">Changelog</a>
          <a sanringNavigationMenuLink href="#" (click)="$event.preventDefault()">Roadmap</a>
          <sanring-navigation-menu-separator />
          <a sanringNavigationMenuLink href="#" (click)="$event.preventDefault()">GitHub</a>
        </sanring-navigation-menu-content>
      </sanring-navigation-menu-item>

      <sanring-navigation-menu-item value="docs">
        <button sanringNavigationMenuTrigger>
          Docs
          <svg lucideChevronRight class="size-4 rotate-90 opacity-70"></svg>
        </button>
        <sanring-navigation-menu-content class="w-72 p-2">
          <a sanringNavigationMenuLink href="#" active (click)="$event.preventDefault()">
            <div>
              <sanring-navigation-menu-label>Introduction</sanring-navigation-menu-label>
              <p sanringNavigationMenuDescription>Start here for the core concepts.</p>
            </div>
          </a>
          <a sanringNavigationMenuLink href="#" (click)="$event.preventDefault()">
            <div>
              <sanring-navigation-menu-label>Installation</sanring-navigation-menu-label>
              <p sanringNavigationMenuDescription>Add the CLI or copy component source.</p>
            </div>
          </a>
          <a sanringNavigationMenuLink href="#" (click)="$event.preventDefault()">
            <div>
              <sanring-navigation-menu-label>CLI</sanring-navigation-menu-label>
              <p sanringNavigationMenuDescription>Command reference for add, diff, update.</p>
            </div>
          </a>
        </sanring-navigation-menu-content>
      </sanring-navigation-menu-item>
    </sanring-navigation-menu-list>
  </sanring-navigation-menu>
</div>`,
  usageImport: `import { Component } from '@angular/core';
import { SANRING_NAVIGATION_MENU_IMPORTS } from './components/ui/navigation-menu';

@Component({
  imports: [SANRING_NAVIGATION_MENU_IMPORTS],
})
export class ExampleComponent {}`,
  usageMain: `<sanring-navigation-menu>
  <sanring-navigation-menu-list>
    <sanring-navigation-menu-item>
      <button sanringNavigationMenuTrigger>Menu</button>
      <sanring-navigation-menu-content class="w-56 p-2">
        <a sanringNavigationMenuLink href="/docs">Docs</a>
        <a sanringNavigationMenuLink href="/pricing">Pricing</a>
      </sanring-navigation-menu-content>
    </sanring-navigation-menu-item>

    <sanring-navigation-menu-item>
      <a sanringNavigationMenuLink href="/about" active>About</a>
    </sanring-navigation-menu-item>
  </sanring-navigation-menu-list>
</sanring-navigation-menu>`,
  usageIndividualImports: `import { Component } from '@angular/core';
import {
  NavigationMenuComponent,
  NavigationMenuListComponent,
  NavigationMenuItemComponent,
  NavigationMenuTriggerDirective,
  NavigationMenuContentComponent,
  NavigationMenuSubComponent,
  NavigationMenuSubTriggerComponent,
  NavigationMenuSubContentComponent,
  NavigationMenuLinkDirective,
} from './components/ui/navigation-menu';

@Component({
  imports: [
    NavigationMenuComponent,
    NavigationMenuListComponent,
    NavigationMenuItemComponent,
    NavigationMenuTriggerDirective,
    NavigationMenuContentComponent,
    NavigationMenuSubComponent,
    NavigationMenuSubTriggerComponent,
    NavigationMenuSubContentComponent,
    NavigationMenuLinkDirective,
  ],
})
export class ExampleComponent {}`,
  viewport: `<!--
  A per-item content panel (see Basic) is sized and positioned per trigger —
  Product's panel is 420px, Resources' is 288px, each flush under its own
  button. A shared viewport instead gives the whole bar ONE panel — same
  size, centered under the whole trigger group — and just swaps the content
  underneath. Note: sanring-navigation-menu is left at its default width (it
  shrink-wraps to the trigger group) — stretching it to the full bar would
  center the panel under empty space instead of under the triggers.
-->
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
      <a sanringNavigationMenuLink href="#" (click)="$event.preventDefault()">Pricing</a>
    </sanring-navigation-menu-item>
  </sanring-navigation-menu-list>

  <!-- Same 320px panel, centered under the group, no matter which item is active. -->
  <sanring-navigation-menu-viewport class="w-80">
    @switch (navValue) {
      @case ('product') {
        <div class="grid gap-1 p-3">
          <a sanringNavigationMenuLink href="#" (click)="$event.preventDefault()">Overview</a>
          <a sanringNavigationMenuLink href="#" (click)="$event.preventDefault()">Integrations</a>
        </div>
      }
      @case ('solutions') {
        <div class="grid gap-1 p-3">
          <a sanringNavigationMenuLink href="#" (click)="$event.preventDefault()">For startups</a>
          <a sanringNavigationMenuLink href="#" (click)="$event.preventDefault()">For enterprise</a>
        </div>
      }
      @case ('enterprise') {
        <div class="grid gap-1 p-3">
          <a sanringNavigationMenuLink href="#" (click)="$event.preventDefault()">Security</a>
          <a sanringNavigationMenuLink href="#" (click)="$event.preventDefault()">Single sign-on</a>
        </div>
      }
    }
  </sanring-navigation-menu-viewport>
</sanring-navigation-menu>`,
  submenu: `<sanring-navigation-menu>
  <sanring-navigation-menu-list>
    <sanring-navigation-menu-item value="docs">
      <button sanringNavigationMenuTrigger>Docs</button>
      <sanring-navigation-menu-content class="w-64 p-2">
        <a sanringNavigationMenuLink href="#">
          Overview
        </a>

        <sanring-navigation-menu-sub>
          <sanring-navigation-menu-sub-trigger>
            Components
          </sanring-navigation-menu-sub-trigger>
          <sanring-navigation-menu-sub-content class="w-48">
            <a sanringNavigationMenuLink href="#" role="menuitem" tabindex="0">Forms</a>
            <a sanringNavigationMenuLink href="#" role="menuitem" tabindex="0">Overlays</a>
            <a sanringNavigationMenuLink href="#" role="menuitem" tabindex="0">Navigation</a>
          </sanring-navigation-menu-sub-content>
        </sanring-navigation-menu-sub>

        <a sanringNavigationMenuLink href="#">
          Theming
        </a>
      </sanring-navigation-menu-content>
    </sanring-navigation-menu-item>
  </sanring-navigation-menu-list>
</sanring-navigation-menu>`,
  vertical: `<!--
  App-shell secondary nav: items stretch full width, and "Team" is a real
  trigger + content group flown out to the SIDE (not below, which would
  overlap the items under it) by overriding the content panel's position
  classes — a common override for vertical rails.
-->
<sanring-navigation-menu orientation="vertical" class="w-56">
  <sanring-navigation-menu-list>
    <sanring-navigation-menu-item>
      <a sanringNavigationMenuLink href="#" active (click)="$event.preventDefault()">
        Dashboard
      </a>
    </sanring-navigation-menu-item>
    <sanring-navigation-menu-item>
      <a sanringNavigationMenuLink href="#" (click)="$event.preventDefault()">Analytics</a>
    </sanring-navigation-menu-item>

    <sanring-navigation-menu-item>
      <button sanringNavigationMenuTrigger class="w-full justify-between">
        Team
        <svg lucideChevronRight class="size-4 shrink-0 opacity-70"></svg>
      </button>
      <sanring-navigation-menu-content class="left-full top-0 mt-0 ml-2 w-52 min-w-0 p-2">
        <a sanringNavigationMenuLink href="#" (click)="$event.preventDefault()">Members</a>
        <a sanringNavigationMenuLink href="#" (click)="$event.preventDefault()">Invite people</a>
        <a sanringNavigationMenuLink href="#" (click)="$event.preventDefault()">
          Roles &amp; permissions
        </a>
      </sanring-navigation-menu-content>
    </sanring-navigation-menu-item>

    <sanring-navigation-menu-item>
      <a sanringNavigationMenuLink href="#" (click)="$event.preventDefault()">Settings</a>
    </sanring-navigation-menu-item>

    <sanring-navigation-menu-separator />

    <sanring-navigation-menu-item>
      <a sanringNavigationMenuLink href="#" disabled (click)="$event.preventDefault()">
        Billing (coming soon)
      </a>
    </sanring-navigation-menu-item>
  </sanring-navigation-menu-list>
</sanring-navigation-menu>`,
} as const;

import { isDevMode } from '@angular/core';
import { TranslationKey } from '../i18n/translations';

export type DocsComponentStatus = 'wip' | 'maintenance';

export const docsComponentStatusBadgeKeys: Record<DocsComponentStatus, TranslationKey> = {
  wip: 'status.wip.badge',
  maintenance: 'status.maintenance.badge',
};

export const docsComponentStatusDotClass: Record<DocsComponentStatus, string> = {
  wip: 'bg-amber-500 shadow-[0_0_0_3px_color-mix(in_srgb,#f59e0b_18%,transparent)]',
  maintenance: 'bg-red-500 shadow-[0_0_0_3px_color-mix(in_srgb,#ef4444_18%,transparent)]',
};

export interface DocsSidebarItem {
  labelKey: TranslationKey;
  path?: string;
  exact?: boolean;
  active?: boolean;
  badge?: boolean;
  disabled?: boolean;
  status?: DocsComponentStatus;
}

export type DocsComponentId =
  | 'accordion'
  | 'alert'
  | 'alert-dialog'
  | 'aspect-ratio'
  | 'avatar'
  | 'badge'
  | 'breadcrumb'
  | 'button'
  | 'calendar'
  | 'card'
  | 'carousel'
  | 'checkbox'
  | 'collapsible'
  | 'command'
  | 'combobox'
  | 'context-menu'
  | 'date-picker'
  | 'dialog'
  | 'divider'
  | 'dropdown-menu'
  | 'field'
  | 'file-upload'
  | 'hover-card'
  | 'input'
  | 'otp-input'
  | 'label'
  | 'link'
  | 'navigation-menu'
  | 'pagination'
  | 'popover'
  | 'progress'
  | 'radio'
  | 'resizable'
  | 'scroll-area'
  | 'select'
  | 'sheet'
  | 'sidebar'
  | 'skeleton'
  | 'slider'
  | 'spinner'
  | 'stepper'
  | 'switch'
  | 'table'
  | 'tag'
  | 'tabs'
  | 'textarea'
  | 'timeline'
  | 'toggle'
  | 'toast'
  | 'tooltip'
  | 'transfer'
  | 'tree';

export interface DocsComponentNavItem extends DocsSidebarItem {
  id: DocsComponentId;
  path: string;
  // 每個元件頁面本來就有這把 key（見 <id>.docs.ts 的 page.descriptionKey），
  // 這裡重複宣告一次是為了讓搜尋面板不用動態 import 所有頁面的 docs data 就能索引描述文字。
  descriptionKey: TranslationKey;
}

export const docsSectionItems: DocsSidebarItem[] = [
  { labelKey: 'sidebar.introduction', path: '/introduction', active: true },
  { labelKey: 'sidebar.theming', path: '/theming', active: true },
  { labelKey: 'sidebar.cli', path: '/cli', active: true },
  { labelKey: 'sidebar.mcpServer', path: '/mcp', active: true },
  { labelKey: 'nav.components', path: '/components', active: true },
  { labelKey: 'sidebar.changelog', path: '/version-notes', active: true },
  { labelKey: 'sidebar.roadmap', path: '/roadmap', active: true },
];

export const docsComponentItems: DocsComponentNavItem[] = [
  {
    id: 'accordion',
    labelKey: 'component.accordion',
    descriptionKey: 'accordion.description',
    path: '/components/accordion',
    active: true,
  },
  {
    id: 'alert',
    labelKey: 'component.alert',
    descriptionKey: 'alert.description',
    path: '/components/alert',
    active: true,
  },
  {
    id: 'alert-dialog',
    labelKey: 'component.alertDialog',
    descriptionKey: 'alertDialog.description',
    path: '/components/alert-dialog',
    active: true,
  },
  {
    id: 'aspect-ratio',
    labelKey: 'component.aspectRatio',
    descriptionKey: 'aspectRatio.description',
    path: '/components/aspect-ratio',
    active: true,
  },
  {
    id: 'avatar',
    labelKey: 'component.avatar',
    descriptionKey: 'avatar.description',
    path: '/components/avatar',
    active: true,
  },
  {
    id: 'badge',
    labelKey: 'component.badge',
    descriptionKey: 'badge.description',
    path: '/components/badge',
    active: true,
  },
  {
    id: 'breadcrumb',
    labelKey: 'component.breadcrumb',
    descriptionKey: 'breadcrumb.description',
    path: '/components/breadcrumb',
    active: true,
  },
  {
    id: 'button',
    labelKey: 'component.button',
    descriptionKey: 'button.description',
    path: '/components/button',
    active: true,
  },
  {
    id: 'calendar',
    labelKey: 'component.calendar',
    descriptionKey: 'calendar.description',
    path: '/components/calendar',
    active: true,
  },
  {
    id: 'card',
    labelKey: 'component.card',
    descriptionKey: 'card.description',
    path: '/components/card',
    active: true,
  },
  {
    id: 'carousel',
    labelKey: 'component.carousel',
    descriptionKey: 'carousel.description',
    path: '/components/carousel',
    active: true,
  },
  {
    id: 'checkbox',
    labelKey: 'component.checkbox',
    descriptionKey: 'checkbox.description',
    path: '/components/checkbox',
    active: true,
  },
  {
    id: 'collapsible',
    labelKey: 'component.collapsible',
    descriptionKey: 'collapsible.description',
    path: '/components/collapsible',
    active: true,
  },
  {
    id: 'command',
    labelKey: 'component.command',
    descriptionKey: 'command.description',
    path: '/components/command',
    active: true,
  },
  {
    id: 'combobox',
    labelKey: 'component.combobox',
    descriptionKey: 'combobox.description',
    path: '/components/combobox',
    active: true,
  },
  {
    id: 'context-menu',
    labelKey: 'component.contextMenu',
    descriptionKey: 'contextMenu.description',
    path: '/components/context-menu',
    active: true,
  },
  {
    id: 'date-picker',
    labelKey: 'component.datePicker',
    descriptionKey: 'datePicker.description',
    path: '/components/date-picker',
    active: true,
  },
  {
    id: 'dialog',
    labelKey: 'component.dialog',
    descriptionKey: 'dialog.description',
    path: '/components/dialog',
    active: true,
  },
  {
    id: 'divider',
    labelKey: 'component.divider',
    descriptionKey: 'divider.description',
    path: '/components/divider',
    active: true,
  },
  {
    id: 'dropdown-menu',
    labelKey: 'component.dropdownMenu',
    descriptionKey: 'dropdownMenu.description',
    path: '/components/dropdown-menu',
    active: true,
  },
  {
    id: 'field',
    labelKey: 'component.field',
    descriptionKey: 'field.description',
    path: '/components/field',
    active: true,
  },
  {
    id: 'file-upload',
    labelKey: 'component.fileUpload',
    descriptionKey: 'fileUpload.description',
    path: '/components/file-upload',
    active: true,
  },
  {
    id: 'hover-card',
    labelKey: 'component.hoverCard',
    descriptionKey: 'hoverCard.description',
    path: '/components/hover-card',
    active: true,
  },
  {
    id: 'input',
    labelKey: 'component.input',
    descriptionKey: 'input.description',
    path: '/components/input',
    active: true,
  },
  {
    id: 'otp-input',
    labelKey: 'component.otpInput',
    descriptionKey: 'otpInput.description',
    path: '/components/otp-input',
    active: true,
  },
  {
    id: 'label',
    labelKey: 'component.label',
    descriptionKey: 'label.description',
    path: '/components/label',
    active: true,
  },
  {
    id: 'link',
    labelKey: 'component.link',
    descriptionKey: 'link.description',
    path: '/components/link',
    active: true,
  },
  {
    id: 'navigation-menu',
    labelKey: 'component.navigationMenu',
    descriptionKey: 'navigationMenu.description',
    path: '/components/navigation-menu',
    active: true,
  },
  {
    id: 'pagination',
    labelKey: 'component.pagination',
    descriptionKey: 'pagination.description',
    path: '/components/pagination',
    active: true,
  },
  {
    id: 'popover',
    labelKey: 'component.popover',
    descriptionKey: 'popover.description',
    path: '/components/popover',
    active: true,
  },
  {
    id: 'progress',
    labelKey: 'component.progress',
    descriptionKey: 'progress.description',
    path: '/components/progress',
    active: true,
  },
  {
    id: 'radio',
    labelKey: 'component.radio',
    descriptionKey: 'radio.description',
    path: '/components/radio',
    active: true,
  },
  {
    id: 'resizable',
    labelKey: 'component.resizable',
    descriptionKey: 'resizable.description',
    path: '/components/resizable',
    active: true,
  },
  {
    id: 'scroll-area',
    labelKey: 'component.scrollArea',
    descriptionKey: 'scrollArea.description',
    path: '/components/scroll-area',
    active: true,
  },
  {
    id: 'select',
    labelKey: 'component.select',
    descriptionKey: 'select.description',
    path: '/components/select',
    active: true,
  },
  {
    id: 'sheet',
    labelKey: 'component.sheet',
    descriptionKey: 'sheet.description',
    path: '/components/sheet',
    active: true,
  },
  {
    id: 'sidebar',
    labelKey: 'component.sidebar',
    descriptionKey: 'sidebar.description',
    path: '/components/sidebar',
    active: true,
  },
  {
    id: 'skeleton',
    labelKey: 'component.skeleton',
    descriptionKey: 'skeleton.description',
    path: '/components/skeleton',
    active: true,
  },
  {
    id: 'slider',
    labelKey: 'component.slider',
    descriptionKey: 'slider.description',
    path: '/components/slider',
    active: true,
  },
  {
    id: 'spinner',
    labelKey: 'component.spinner',
    descriptionKey: 'spinner.description',
    path: '/components/spinner',
    active: true,
  },
  {
    id: 'stepper',
    labelKey: 'component.stepper',
    descriptionKey: 'stepper.description',
    path: '/components/stepper',
    active: true,
  },
  {
    id: 'switch',
    labelKey: 'component.switch',
    descriptionKey: 'switch.description',
    path: '/components/switch',
    active: true,
  },
  {
    id: 'table',
    labelKey: 'component.table',
    descriptionKey: 'table.description',
    path: '/components/table',
    active: true,
  },
  {
    id: 'textarea',
    labelKey: 'component.textarea',
    descriptionKey: 'textarea.description',
    path: '/components/textarea',
    active: true,
  },
  {
    id: 'timeline',
    labelKey: 'component.timeline',
    descriptionKey: 'timeline.description',
    path: '/components/timeline',
    active: true,
  },
  {
    id: 'tag',
    labelKey: 'component.tag',
    descriptionKey: 'tag.description',
    path: '/components/tag',
    active: true,
  },
  {
    id: 'tabs',
    labelKey: 'component.tabs',
    descriptionKey: 'tabs.description',
    path: '/components/tabs',
    active: true,
  },
  {
    id: 'toggle',
    labelKey: 'component.toggle',
    descriptionKey: 'toggle.description',
    path: '/components/toggle',
    active: true,
  },
  {
    id: 'toast',
    labelKey: 'component.toast',
    descriptionKey: 'toast.description',
    path: '/components/toast',
    active: true,
  },
  {
    id: 'tooltip',
    labelKey: 'component.tooltip',
    descriptionKey: 'tooltip.description',
    path: '/components/tooltip',
    active: true,
  },
  {
    id: 'transfer',
    labelKey: 'component.transfer',
    descriptionKey: 'transfer.description',
    path: '/components/transfer',
    active: true,
  },
  {
    id: 'tree',
    labelKey: 'component.tree',
    descriptionKey: 'tree.description',
    path: '/components/tree',
    active: true,
  },
];

export const docsComponentItemsById = new Map(docsComponentItems.map((item) => [item.id, item]));

/**
 * Items under active maintenance are pulled from production nav (sidebar, components list,
 * homepage) but stay reachable by direct URL and stay visible while developing locally.
 */
export const visibleDocsComponentItems = docsComponentItems.filter(
  (item) => item.status !== 'maintenance' || isDevMode(),
);

const enabledDocsComponentItems = docsComponentItems.filter((item) => !item.disabled);

export function getAdjacentDocsComponent(id: DocsComponentId) {
  const currentIndex = enabledDocsComponentItems.findIndex((item) => item.id === id);

  return {
    previous: currentIndex > 0 ? enabledDocsComponentItems[currentIndex - 1] : null,
    next:
      currentIndex >= 0 && currentIndex < enabledDocsComponentItems.length - 1
        ? enabledDocsComponentItems[currentIndex + 1]
        : null,
  };
}

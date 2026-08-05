export const tooltipTranslations = {
  'tooltip.description':
    'A small floating panel that reveals contextual information when a trigger is hovered or focused.',
  'tooltip.demo.hover': 'Hover me',
  'tooltip.demo.basicContent': 'Helpful contextual detail.',
  'tooltip.demo.side': 'Side',
  'tooltip.demo.top': 'Top',
  'tooltip.demo.right': 'Right',
  'tooltip.demo.bottom': 'Bottom',
  'tooltip.demo.left': 'Left',
  'tooltip.demo.topContent': 'Top tooltip',
  'tooltip.demo.rightContent': 'Right tooltip',
  'tooltip.demo.bottomContent': 'Bottom tooltip',
  'tooltip.demo.leftContent': 'Left tooltip',
  'tooltip.demo.delay': 'Delayed tooltip',
  'tooltip.demo.delayContent': 'Opens after 600ms.',
  'tooltip.demo.customContent': 'Custom content',
  'tooltip.demo.status': 'Status',
  'tooltip.demo.statusTitle': 'Workspace is synced',
  'tooltip.demo.statusDescription': 'Last updated just now.',
  'tooltip.examples.description':
    'Tooltip patterns for simple hints, delayed display, and compact structured content.',
  'tooltip.examples.basic.description':
    'Wrap a trigger and content inside sanring-tooltip. The content opens on hover or focus.',
  'tooltip.usage.description':
    'Import TooltipComponent, TooltipTriggerDirective, and TooltipContentComponent.',
  'tooltip.installation.description':
    'Use sanringTooltipTrigger on a focusable element and provide matching tooltip content.',
  'tooltip.composition.description':
    'Tooltip is composed from a state root, a trigger directive, and floating content.',
  'tooltip.api.description': 'Inputs supported by the tooltip primitives.',
  'tooltip.api.delayDuration.description': 'Delay in milliseconds before the tooltip opens.',
  'tooltip.api.side.description':
    'Preferred side for the tooltip before fallback positions are used.',
  'tooltip.api.sideOffset.description': 'Distance between the trigger and floating content.',
  'tooltip.api.class.description': 'Additional classes merged with root or content styles.',
  'tooltip.accessibility.description':
    "The tooltip panel has role='tooltip'. When open, the trigger element gets aria-describedby pointing to the tooltip's id, so screen readers announce the tooltip text along with the trigger's accessible name.",
  'tooltip.keyboard.description': 'The tooltip follows hover and keyboard focus lifecycle.',
  'tooltip.keyboard.focus': 'Show the tooltip (after the configured delay).',
  'tooltip.keyboard.blur': 'Hide the tooltip.',
  'tooltip.keyboard.escape': 'Immediately hide the tooltip while the trigger is focused.',
  'tooltip.stateModel.description':
    "Automatic. TooltipComponent manages open/closed state internally based on hover and focus events on the trigger. Use the delayDuration input to control the show delay in milliseconds. There is no manual open/close API — the tooltip follows the natural hover/focus lifecycle.",
} as const;

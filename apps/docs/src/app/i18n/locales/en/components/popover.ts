export const popoverTranslations = {
  'popover.description':
    'A floating panel positioned relative to a trigger — ideal for contextual menus, rich tooltips, and form overlays without blocking the main flow.',
  'popover.examples.basic.description':
    'Default popover anchored below its trigger, centred horizontally.',
  'popover.usage.description':
    "Wrap trigger and content inside sanring-popover. The content positions itself automatically using the trigger element's coordinates.",
  'popover.installation.description':
    'Add the component with the CLI, then import the popover primitives, or use SANRING_POPOVER_IMPORTS for convenience.',
  'popover.composition.description':
    'Popover is composed from a root, trigger directive, and content panel with optional header, title, and description.',
  'popover.examples.description':
    'Common popover patterns: alignment, user profile overlay, and form controls.',
  'popover.demo.align': 'Align',
  'popover.demo.side': 'Side',
  'popover.api.side.description':
    "Preferred side of the trigger: 'top', 'right', 'bottom' (default), or 'left'. The panel flips if it would overflow the viewport.",
  'popover.api.sideOffset.description': 'Distance in pixels between the trigger and the panel.',
  'popover.api.ariaLabel.description':
    'Accessible-name fallback used when no sanring-popover-title is projected and ariaLabelledBy is unset.',
  'popover.api.ariaLabelledBy.description':
    'Ids of external elements that label the panel. Takes precedence over PopoverTitle and ariaLabel.',
  'popover.demo.withHeader': 'With Header',
  'popover.demo.profile': 'User profile',
  'popover.demo.profileEmail': 'jane@example.com',
  'popover.demo.openProfile': 'Open profile',
  'popover.demo.close': 'Close',
  'popover.api.description': 'Inputs and model supported by the popover primitives.',
  'popover.api.isOpen.description':
    'Controls whether the popover is visible. Supports [(isOpen)] two-way binding.',
  'popover.api.align.description':
    "Alignment relative to the trigger: 'start', 'center' (default), or 'end'.",
  'popover.api.class.description': 'Additional classes merged onto the floating panel.',
  'popover.accessibility.description':
    "The trigger button has aria-haspopup='dialog', aria-expanded, and aria-controls pointing to the panel id. The panel carries role='dialog'. Project sanring-popover-title to wire aria-labelledby, or set ariaLabel / ariaLabelledBy when the panel has no title.",
  'popover.keyboard.description': 'Focus moves into the panel when it opens.',
  'popover.keyboard.escape': 'Close the popover panel and return focus to the trigger.',
  'popover.keyboard.tab': 'Move focus to the next focusable element inside the panel.',
  'popover.keyboard.shiftTab': 'Move focus to the previous focusable element inside the panel.',
  'popover.stateModel.description':
    "Toggle-based. The PopoverComponent exposes an isOpen model signal. Bind [sanringPopoverTrigger] to the popover reference for declarative control, or call popover.open() / popover.close() programmatically. Not a CVA form control.",
} as const;

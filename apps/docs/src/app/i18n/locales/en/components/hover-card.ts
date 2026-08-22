export const hoverCardTranslations = {
  'hoverCard.description':
    'A floating preview panel that opens from hover or keyboard focus, useful for profile summaries and lightweight context.',
  'hoverCard.examples.basic.description':
    'Wrap a trigger and content together. The card opens on hover or focus and closes after the configured delay.',
  'hoverCard.usage.description':
    'Import the hover-card primitives and apply sanringHoverCardTrigger to the element that should anchor the floating panel.',
  'hoverCard.installation.description':
    'Add the component with the CLI, then import SANRING_HOVER_CARD_IMPORTS for the root, trigger, and content primitives.',
  'hoverCard.composition.description':
    'Hover Card separates the delay controller, trigger anchor, and floating content panel.',
  'hoverCard.demo.trigger': '@sanring/ui',
  'hoverCard.demo.description':
    'Composable Angular primitives for dashboards, forms, overlays, and data-heavy interfaces.',
  'hoverCard.demo.side': 'Side',
  'hoverCard.demo.sideDescription': 'The panel repositions when it would overflow the viewport.',
  'hoverCard.demo.delay': 'Delay',
  'hoverCard.demo.fastOpen': 'Fast open',
  'hoverCard.demo.delayDescription':
    'Use shorter openDelay for dense application UI and a forgiving closeDelay while the pointer moves.',
  'hoverCard.api.description': 'Inputs supported by the hover-card root and content primitives.',
  'hoverCard.api.openDelay.description':
    'Delay in milliseconds before opening after hover or focus.',
  'hoverCard.api.closeDelay.description':
    'Delay in milliseconds before closing after pointer or focus leaves.',
  'hoverCard.api.side.description':
    'Preferred side for the floating panel. CDK overlay may flip it to stay visible.',
  'hoverCard.api.sideOffset.description':
    'Distance in pixels between the trigger and floating panel.',
  'hoverCard.api.class.description': 'Additional classes merged onto the floating content panel.',
  'hoverCard.api.ariaLabel.description':
    'Accessible name for the content region when ariaLabelledBy is not set.',
  'hoverCard.api.ariaLabelledBy.description':
    'Ids of external elements that label the content region. Takes precedence over ariaLabel.',
  'hoverCard.accessibility.description':
    'The trigger keeps native focus behavior and links aria-expanded/aria-controls to a named content region. Escape closes it. Hover Card is best for supplemental context, not required click targets.',
  'hoverCard.keyboard.description':
    'Hover Card opens from pointer hover and keyboard focus on the trigger.',
  'hoverCard.keyboard.focus': 'Focuses the trigger and opens the floating panel after openDelay.',
  'hoverCard.keyboard.blur': 'Moves focus away and closes the panel after closeDelay.',
  'hoverCard.keyboard.escape': 'Closes the panel when focus is inside the trigger or content.',
  'hoverCard.stateModel.description':
    'Open state is managed internally by the root and responds to openDelay, closeDelay, hover, focus, and Escape. Not a ControlValueAccessor.',
} as const;

export const breadcrumbTranslations = {
  'breadcrumb.description':
    "A navigation aid showing the user's current location within a hierarchy — built from composable primitives with full accessibility support.",
  'breadcrumb.examples.basic.description':
    'Three-level breadcrumb using the default chevron divider.',
  'breadcrumb.usage.description':
    'Compose a breadcrumb-list of breadcrumb-items separated by breadcrumb-dividers. End the trail with breadcrumb-page for the current location.',
  'breadcrumb.installation.description':
    'Add the component with the CLI, then import the breadcrumb primitives, or use SANRING_BREADCRUMB_IMPORTS for convenience.',
  'breadcrumb.composition.description':
    'Breadcrumb is built from a nav root, an ordered list, items, links, a page marker, a divider, and an optional ellipsis for collapsed paths.',
  'breadcrumb.examples.description':
    'Common breadcrumb patterns: divider variants, collapsed paths with ellipsis, and custom separators.',
  'breadcrumb.demo.divider': 'Divider',
  'breadcrumb.demo.withEllipsis': 'With Ellipsis',
  'breadcrumb.demo.customDivider': 'Custom Divider',
  'breadcrumb.api.description': 'Inputs supported by the breadcrumb primitives.',
  'breadcrumb.api.type.description':
    "Divider icon: 'chevron' (default, ›) or 'dot' (·). Pass custom content via ng-content to override entirely.",
  'breadcrumb.api.routerLink.description':
    'Angular RouterLink value passed to the inner anchor element.',
  'breadcrumb.api.class.description': 'Additional classes merged onto the host element.',
  'breadcrumb.accessibility.description': "role='navigation' and aria-label='breadcrumb' on the host element. Mark the current page with aria-current='page' on the <sanring-breadcrumb-page> element so screen readers announce the user's current location.",
  'breadcrumb.keyboard.description': 'Standard anchor keyboard behavior.',
  'breadcrumb.keyboard.tab': 'Navigate forward through breadcrumb links.',
  'breadcrumb.keyboard.shiftTab': 'Navigate backward through breadcrumb links.',
  'breadcrumb.stateModel.description': 'Stateless — items are rendered via template projection. No internal selection state.',
} as const;

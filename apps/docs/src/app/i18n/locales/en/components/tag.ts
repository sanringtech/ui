export const tagTranslations = {
  'tag.description':
    'A compact removable or static label built on Badge for filters, selections, and categorization.',
  'tag.demo.default': 'Tag',
  'tag.demo.closable': 'Closable',
  'tag.demo.variants': 'Variants',
  'tag.demo.list': 'Tag list',
  'tag.demo.secondary': 'Secondary',
  'tag.demo.outline': 'Outline',
  'tag.demo.destructive': 'Destructive',
  'tag.demo.frontend': 'Frontend',
  'tag.examples.description': 'Common tag patterns for filters, chips, and categorized content.',
  'tag.examples.basic.description': 'Use tags for selected values or compact content categories.',
  'tag.usage.description': 'Import TagComponent and project label content inside it.',
  'tag.installation.description':
    'Import Tag and optionally enable closable when the tag should emit a remove event.',
  'tag.composition.description':
    'Tag composes Badge styling with projected content and an optional close affordance.',
  'tag.api.description': 'Inputs and outputs supported by the sanring-tag component.',
  'tag.api.class.description': 'Additional classes merged with the inner badge styles.',
  'tag.api.variant.description': 'Passes the visual variant through to the inner badge.',
  'tag.api.closable.description': 'Shows a compact remove button and supports attribute shorthand.',
  'tag.api.removeAriaLabel.description': 'Accessible label for the remove button.',
  'tag.api.remove.description': 'Emits when the remove button is clicked.',
  'tag.accessibility.description':
    "Built on sanring-badge. When closable is true, the remove button has an accessible label from the removeAriaLabel input. Provide a meaningful label like 'Remove JavaScript' rather than a generic 'Remove' when surrounding text does not unambiguously identify the tag.",
  'tag.keyboard.description': 'Remove button keyboard behavior when closable is true.',
  'tag.keyboard.tab': 'Move focus to the remove button.',
  'tag.keyboard.enterOrSpace': 'Activate the remove button and emit the remove output.',
  'tag.stateModel.description':
    'Stateless — the parent component handles the remove output to filter the tag list. No internal selection or value state.',
} as const;

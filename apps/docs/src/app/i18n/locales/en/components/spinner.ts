export const spinnerTranslations = {
  'spinner.description':
    'A lightweight animated loading indicator with three icon variants, four sizes, and full colour control via text utilities.',
  'spinner.examples.basic.description': 'Default spinner using the loader icon at medium size.',
  'spinner.usage.description':
    'Import SpinnerComponent and drop sanring-spinner anywhere. Text colour and size are controlled with Tailwind utilities.',
  'spinner.installation.description':
    'Add the component with the CLI, then import SpinnerComponent.',
  'spinner.examples.description':
    'Common spinner patterns covering variants, sizes, colours, inline labels, and button loading states.',
  'spinner.demo.variant': 'Variant',
  'spinner.demo.size': 'Size',
  'spinner.demo.color': 'Color',
  'spinner.demo.withLabel': 'With Label',
  'spinner.demo.inButton': 'In Button',
  'spinner.demo.loading': 'Loading…',
  'spinner.demo.saving': 'Saving…',
  'spinner.demo.speed': 'Speed',
  'spinner.api.description': 'Inputs supported by sanring-spinner.',
  'spinner.api.speed.description':
    "Rotation speed: 'slow' (2 s), 'normal' (1 s, default), or 'fast' (0.5 s). Composes the full animation value so there are no cascade-order issues.",
  'spinner.api.variant.description':
    "Icon style: 'loader' (dashed ring, default), 'loader-circle' (arc), or 'pinwheel'.",
  'spinner.api.size.description':
    "Size of the icon: 'sm' (16px), 'md' (20px, default), 'lg' (24px), or 'xl' (32px).",
  'spinner.api.class.description':
    'Additional classes merged onto the host element. Use Tailwind text-* utilities to change colour.',
  'spinner.api.ariaLabel.description':
    "Accessible label announced by screen readers. Defaults to 'Loading'.",
  'spinner.accessibility.description':
    "role='status' on the host (polite live region). aria-label defaults to 'Loading' — override with a specific message (e.g., 'Saving changes') when multiple spinners appear simultaneously.",
  'spinner.keyboard.description': 'Not focusable. No keyboard interaction.',
  'spinner.stateModel.description': 'Stateless — variant, size, and speed inputs only.',
} as const;

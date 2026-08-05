export const progressTranslations = {
  'progress.description':
    'A horizontal progress bar with WAI-ARIA progressbar semantics, shimmer sprint effect, and customisable shape and colour.',
  'progress.examples.basic.description': 'A progress bar at 60% in its default rounded style.',
  'progress.usage.description':
    'Import ProgressComponent and bind a numeric value. The directive handles all ARIA attributes automatically.',
  'progress.installation.description':
    'Add the component with the CLI, then import ProgressComponent or ProgressDirective.',
  'progress.examples.description':
    'Three questions answered with live examples: shimmer effect, shape variants, and colour customisation.',
  'progress.demo.shimmer': 'Shimmer Sprint Effect',
  'progress.demo.shimmerDescription':
    "Like skeleton's pulse, the shimmer sweeps across the fill bar while progress is in flight — giving the user a sense of active momentum.",
  'progress.demo.shape': 'Shape',
  'progress.demo.shapeDescription':
    'Use the shape input to switch between rounded (pill), square (flat edges), and trapezoid (angled parallelogram). All shapes wire through cn() so you can further refine with class.',
  'progress.demo.rounded': 'Rounded',
  'progress.demo.square': 'Square',
  'progress.demo.trapezoid': 'Trapezoid',
  'progress.demo.color': 'Color',
  'progress.demo.colorDescription':
    'Three layers of colour control: default CSS variable, CSS variable override per-instance, and a one-off barClass Tailwind class.',
  'progress.demo.defaultColor': 'Default (CSS var)',
  'progress.demo.cssVarOverride': 'CSS variable override',
  'progress.demo.classOverride': 'barClass override',
  'progress.api.description': 'Inputs supported by sanring-progress.',
  'progress.api.class.description': 'Extra classes merged onto the track container.',
  'progress.api.barClass.description':
    'Extra classes merged onto the fill bar — use for one-off colour overrides.',
  'progress.api.value.description': 'Current progress value.',
  'progress.api.max.description': 'Maximum value; defaults to 100.',
  'progress.api.shape.description':
    "Track shape: 'rounded' (pill, default), 'square' (flat), or 'trapezoid' (angled).",
  'progress.api.shimmer.description':
    'Enables a sweeping shimmer animation on the fill bar to signal active progress.',
  'progress.api.ariaLabel.description':
    'Accessible label for the progressbar role. Recommended when no visible label is present.',
  'progress.api.ariaValueText.description':
    'Human-readable text announced instead of the raw percentage, e.g. "3 of 5 steps complete".',
  'progress.accessibility.description':
    "role='progressbar', aria-valuenow, aria-valuemin (0), aria-valuemax (max input, default 100). Provide ariaLabel or an aria-labelledby pointing to a visible label to identify what is being measured. Use ariaValueText for a human-readable format like '3 of 5 steps complete'.",
  'progress.keyboard.description': 'Not focusable. No keyboard interaction.',
  'progress.stateModel.description':
    'Controlled via the value input (0 to max). Omit value or pass null for indeterminate state (shows shimmer when shimmer is enabled).',
} as const;

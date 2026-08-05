export const carouselTranslations = {
  'carousel.description':
    'A composable carousel built on Embla for horizontal or vertical slide navigation.',
  'carousel.examples.basic.description':
    'Compose the root, content, item, and navigation button directives to build a carousel.',
  'carousel.usage.description':
    'Import the carousel primitives and pass Embla options through the opts input.',
  'carousel.installation.description':
    'Add the component with the CLI, then import the carousel primitives into the standalone component that renders slides.',
  'carousel.composition.description':
    'Carousel separates the Embla viewport, slide items, and navigation controls so each piece can be styled independently.',
  'carousel.demo.featured': 'Featured projects',
  'carousel.demo.teamHighlights': 'Team highlights',
  'carousel.demo.releaseNotes': 'Release notes',
  'carousel.demo.previous': 'Previous slide',
  'carousel.demo.next': 'Next slide',
  'carousel.demo.multiple': 'Multiple visible slides',
  'carousel.demo.vertical': 'Vertical',
  'carousel.demo.sizes': 'Sizes',
  'carousel.demo.sizesLabel': 'Sized slides',
  'carousel.examples.sizes.description':
    'Use the basis utility class on sanring-carousel-item to control how many slides are visible at once.',
  'carousel.api.description': 'Inputs and directives supported by the carousel primitives.',
  'carousel.api.orientation.description':
    'Sets the carousel axis. Horizontal maps to Embla x-axis, vertical maps to y-axis.',
  'carousel.api.opts.description':
    'Embla options passed to the underlying carousel instance, such as loop or align.',
  'carousel.api.ariaLabel.description': 'Accessible label applied to the carousel region.',
  'carousel.api.class.description': 'Additional classes merged onto the carousel root.',
  'carousel.api.previous.description':
    'Directive for a button that scrolls to the previous slide and disables itself at the start.',
  'carousel.api.next.description':
    'Directive for a button that scrolls to the next slide and disables itself at the end.',
  'carousel.accessibility.description': "role='region' and aria-roledescription='carousel' on the host. Provide an ariaLabel input to name the carousel region — required for screen readers to identify it. Navigation buttons (sanring-carousel-previous / sanring-carousel-next) each need a descriptive aria-label attribute.",
  'carousel.keyboard.description': 'Arrow-key slide navigation when the carousel root is focused.',
  'carousel.keyboard.arrowLeftRight': 'Previous / next slide (horizontal orientation).',
  'carousel.keyboard.arrowUpDown': 'Previous / next slide (vertical orientation).',
  'carousel.stateModel.description': 'Slide position is managed by the Embla engine internally. Pass Embla options via the opts input (loop, align, etc.). No CVA.',
} as const;

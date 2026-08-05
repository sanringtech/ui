export const scrollAreaTranslations = {
  'scrollArea.description':
    'A scrollable region primitive for bounded content, lists, and feeds that can emit when the user reaches the end.',
  'scrollArea.demo.basic': 'Bounded content',
  'scrollArea.demo.direction': 'Direction',
  'scrollArea.demo.infinite': 'Infinite scroll',
  'scrollArea.demo.hideScrollbar': 'Hide scrollbar',
  'scrollArea.demo.customScrollbar': 'Custom scrollbar colors',
  'scrollArea.demo.item': 'Activity',
  'scrollArea.demo.itemDescription':
    'A compact feed row that stays inside the scroll container while the surrounding page remains stable.',
  'scrollArea.demo.loaded': 'Loaded',
  'scrollArea.examples.description':
    'Use Scroll Area for dense content that should scroll inside its own region.',
  'scrollArea.examples.basic.description':
    'Apply sanringScrollArea to a fixed-height container to receive overflow behavior and CDK scroll tracking.',
  'scrollArea.usage.description':
    'Import ScrollAreaComponent for direction-aware containers, and use the directives when you need scroll events.',
  'scrollArea.installation.description':
    'Use sanringScrollArea on the scroll container; add sanringInfiniteScroll when the bottom of the list should request more content.',
  'scrollArea.api.description':
    'Inputs and outputs supported by sanringScrollArea and sanringInfiniteScroll.',
  'scrollArea.api.class.description': 'Additional classes merged with the base scroll area layout.',
  'scrollArea.api.orientation.description':
    'Controls the allowed scroll direction on sanring-scroll-area.',
  'scrollArea.api.loadMore.description':
    'Emits after the scroll area reaches the bottom threshold.',
  'scrollArea.api.hideScrollbar.description':
    'When true, hides the scrollbar while preserving scroll functionality.',
  'scrollArea.api.scrollbarThumb.description':
    'CSS custom property that controls the scrollbar thumb color.',
  'scrollArea.api.scrollbarTrack.description':
    'CSS custom property that controls the scrollbar track background.',
  'scrollArea.accessibility.description':
    'Preserves the semantics of the content inside. For bounded regions with lots of content, add aria-label, aria-labelledby, or a visible heading based on context.',
  'scrollArea.stateModel.description':
    'Does not persist scroll position. sanringInfiniteScroll only emits loadMore at the threshold; loading state, cursors, and data collections are owned by the host component.',
} as const;

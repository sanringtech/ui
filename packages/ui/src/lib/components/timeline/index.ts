export * from './timeline.directive';
export * from './timeline-content.directive';
export * from './timeline-item.directive';
export * from './timeline-separator.directive';
export * from './timeline-type';

import { TimelineContentDirective } from './timeline-content.directive';
import { TimelineItemDirective } from './timeline-item.directive';
import { TimelineSeparatorDirective } from './timeline-separator.directive';
import { TimelineDirective } from './timeline.directive';

export const SANRING_TIMELINE_IMPORTS = [
  TimelineDirective,
  TimelineItemDirective,
  TimelineSeparatorDirective,
  TimelineContentDirective,
];

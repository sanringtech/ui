import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { TimelineContentDirective } from './timeline-content.directive';
import { TimelineItemDirective } from './timeline-item.directive';
import { TimelineSeparatorDirective } from './timeline-separator.directive';
import { TimelineDirective } from './timeline.directive';

@Component({
  imports: [
    TimelineContentDirective,
    TimelineDirective,
    TimelineItemDirective,
    TimelineSeparatorDirective,
  ],
  template: `
    <ul sanringTimeline orientation="horizontal" class="custom-timeline">
      <li sanringTimelineItem>
        <span sanringTimelineSeparator></span>
        <div sanringTimelineContent>First event</div>
      </li>
    </ul>

    <div sanringTimeline>
      <div sanringTimelineItem>
        <div sanringTimelineContent>Second event</div>
      </div>
    </div>
  `,
})
class TimelineTestHost {}

describe('Timeline primitives', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelineTestHost],
    }).compileComponents();
  });

  it('always sets list roles, even on native ul/li (Tailwind Preflight strips their implicit role)', () => {
    const fixture = TestBed.createComponent(TimelineTestHost);
    fixture.detectChanges();

    const timeline = fixture.nativeElement.querySelector('ul[sanringTimeline]');
    const item = fixture.nativeElement.querySelector('li[sanringTimelineItem]');
    const separator = fixture.nativeElement.querySelector('[sanringTimelineSeparator]');

    expect(timeline.getAttribute('role')).toBe('list');
    expect(timeline.getAttribute('data-orientation')).toBe('horizontal');
    expect(timeline.classList).toContain('flex-row');
    expect(timeline.classList).toContain('custom-timeline');
    expect(item.getAttribute('role')).toBe('listitem');
    expect(separator.getAttribute('aria-hidden')).toBe('true');
  });

  it('adds list roles for div-based timelines', () => {
    const fixture = TestBed.createComponent(TimelineTestHost);
    fixture.detectChanges();

    const timeline = fixture.nativeElement.querySelector('div[sanringTimeline]');
    const item = timeline.querySelector('div[sanringTimelineItem]');

    expect(timeline.getAttribute('role')).toBe('list');
    expect(item.getAttribute('role')).toBe('listitem');
    expect(timeline.classList).toContain('flex-col');
  });

  it('stacks item content in a column and the separator in a row for horizontal orientation', () => {
    const fixture = TestBed.createComponent(TimelineTestHost);
    fixture.detectChanges();

    const item = fixture.nativeElement.querySelector('li[sanringTimelineItem]');
    const separator = fixture.nativeElement.querySelector('[sanringTimelineSeparator]');

    expect(item.classList).toContain('flex-col');
    expect(item.classList).not.toContain('flex-row');
    expect(separator.classList).toContain('flex-row');
    expect(separator.classList).not.toContain('flex-col');
  });

  it('lays out item content in a row and the separator in a column for vertical (default) orientation', () => {
    const fixture = TestBed.createComponent(TimelineTestHost);
    fixture.detectChanges();

    const timeline = fixture.nativeElement.querySelector('div[sanringTimeline]');
    const item = timeline.querySelector('div[sanringTimelineItem]');

    expect(item.classList).toContain('flex-row');
    expect(item.classList).not.toContain('flex-col');
  });
});

import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { TextareaDirective } from './textarea.directive';

@Component({
  imports: [TextareaDirective],
  template: `<textarea sanringTextarea class="resize-y" placeholder="Message"></textarea>`,
})
class TextareaTestHost {}

describe('TextareaDirective', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextareaTestHost],
    }).compileComponents();
  });

  it('applies base textarea classes and preserves custom classes', () => {
    const fixture = TestBed.createComponent(TextareaTestHost);
    fixture.detectChanges();

    const textarea = fixture.nativeElement.querySelector('[sanringTextarea]') as HTMLTextAreaElement;

    expect(textarea.classList.contains('min-h-[80px]')).toBe(true);
    expect(textarea.classList.contains('w-full')).toBe(true);
    expect(textarea.classList.contains('resize-y')).toBe(true);
  });
});

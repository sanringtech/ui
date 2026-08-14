import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { expectNoA11yViolations } from '../../../testing/axe-a11y';
import { ResizableGroupComponent } from './resizable-group.component';
import { ResizableHandleComponent } from './resizable-handle.component';
import { ResizablePanelComponent } from './resizable-panel.component';

@Component({
  imports: [ResizableGroupComponent, ResizablePanelComponent, ResizableHandleComponent],
  template: `
    <sanring-resizable-group
      class="custom-group"
      [(sizes)]="sizes"
      direction="horizontal"
    >
      <sanring-resizable-panel class="custom-panel" [defaultSize]="40">One</sanring-resizable-panel>
      <sanring-resizable-handle class="custom-handle" [withHandle]="true" [keyboardStep]="10" />
      <sanring-resizable-panel [defaultSize]="60">Two</sanring-resizable-panel>
    </sanring-resizable-group>
  `,
})
class ResizableTestHost {
  sizes = [40, 60];
}

describe('ResizableComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResizableTestHost],
    }).compileComponents();
  });

  async function setup() {
    const fixture = TestBed.createComponent(ResizableTestHost);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture;
  }

  it('renders without error', async () => {
    const fixture = await setup();

    expect(fixture.nativeElement).toBeTruthy();
  });

  it('renders panels and an accessible separator handle', async () => {
    const fixture = await setup();

    const group = fixture.nativeElement.querySelector('sanring-resizable-group') as HTMLElement;
    const panels = fixture.nativeElement.querySelectorAll('sanring-resizable-panel');
    const handle = fixture.nativeElement.querySelector('sanring-resizable-handle') as HTMLElement;

    expect(group.className).toContain('custom-group');
    expect(group.className).toContain('flex-row');
    expect(panels.length).toBe(2);
    expect(panels[0].className).toContain('custom-panel');
    expect(handle.getAttribute('role')).toBe('separator');
    expect(handle.getAttribute('aria-orientation')).toBe('horizontal');
    expect(handle.getAttribute('tabindex')).toBe('0');
    expect(handle.className).toContain('custom-handle');
    // aria-valuenow reflects the size of the panel immediately before the handle (the one a
    // keyboard user is actually adjusting); min/max fall back to that panel's own constraints.
    expect(handle.getAttribute('aria-valuenow')).toBe('40');
    expect(handle.getAttribute('aria-valuemin')).toBe('0');
    expect(handle.getAttribute('aria-valuemax')).toBe('100');
  });

  it('resizes adjacent panels with keyboard arrows', async () => {
    const fixture = await setup();

    const handle = fixture.nativeElement.querySelector('sanring-resizable-handle') as HTMLElement;
    handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.sizes).toEqual([50, 50]);
    expect(handle.getAttribute('aria-valuenow')).toBe('50');
  });

  it('jumps to the min/max size with Home/End', async () => {
    const fixture = await setup();

    const handle = fixture.nativeElement.querySelector('sanring-resizable-handle') as HTMLElement;

    handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.sizes).toEqual([100, 0]);

    handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.sizes).toEqual([0, 100]);
  });

  it('has no axe-detectable a11y violations', async () => {
    const fixture = await setup();

    await expectNoA11yViolations(fixture.nativeElement);
  });
});

@Component({
  imports: [ResizableGroupComponent, ResizablePanelComponent, ResizableHandleComponent],
  template: `
    <sanring-resizable-group [(sizes)]="sizes" [disabled]="disabled">
      <sanring-resizable-panel [defaultSize]="40">One</sanring-resizable-panel>
      <sanring-resizable-handle [keyboardStep]="10" />
      <sanring-resizable-panel [defaultSize]="60">Two</sanring-resizable-panel>
    </sanring-resizable-group>
  `,
})
class ResizableDisabledTestHost {
  sizes = [40, 60];
  disabled = true;
}

describe('ResizableComponent (disabled)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResizableDisabledTestHost],
    }).compileComponents();
  });

  it('marks the handle non-interactive and ignores keyboard resize while the group is disabled', async () => {
    const fixture = TestBed.createComponent(ResizableDisabledTestHost);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const handle = fixture.nativeElement.querySelector('sanring-resizable-handle') as HTMLElement;

    expect(handle.getAttribute('aria-disabled')).toBe('true');
    expect(handle.getAttribute('tabindex')).toBe('-1');

    handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.sizes).toEqual([40, 60]);
  });
});

@Component({
  imports: [ResizableGroupComponent, ResizablePanelComponent, ResizableHandleComponent],
  template: `
    <sanring-resizable-group [(sizes)]="sizes">
      <sanring-resizable-panel
        [defaultSize]="40"
        [collapsible]="true"
        [collapsedSize]="0"
        [minSize]="20"
      >
        One
      </sanring-resizable-panel>
      <sanring-resizable-handle [keyboardStep]="25" />
      <sanring-resizable-panel [defaultSize]="60">Two</sanring-resizable-panel>
    </sanring-resizable-group>
  `,
})
class ResizableCollapsibleTestHost {
  sizes = [40, 60];
}

describe('ResizableComponent (collapsible panel)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResizableCollapsibleTestHost],
    }).compileComponents();
  });

  it('snaps a collapsible panel to its collapsedSize once dragged past minSize, instead of clamping at minSize', async () => {
    const fixture = TestBed.createComponent(ResizableCollapsibleTestHost);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const handle = fixture.nativeElement.querySelector('sanring-resizable-handle') as HTMLElement;

    // step=25 從 40 打到 15 —— 已經低於 minSize(20),collapsible panel 應該直接吸附到
    // collapsedSize(0),而不是卡在 minSize(20)。
    handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.sizes).toEqual([0, 100]);
  });
});

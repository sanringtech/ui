import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { TreeComponent } from './tree.component';
import { TreeGroupComponent } from './tree-group.component';
import { TreeNodeComponent } from './tree-node.component';
import { TreeTriggerDirective } from './tree-trigger.directive';

@Component({
  imports: [TreeComponent, TreeNodeComponent, TreeGroupComponent, TreeTriggerDirective],
  template: `
    <sanring-tree
      [expandedValue]="expandedValue()"
      (expandedValueChange)="expandedValue.set($event)"
      [selectedValue]="selectedValue()"
      (selectedValueChange)="selectedValue.set($event)"
      #tree
    >
      <sanring-tree-node value="src">
        <button type="button" tabindex="-1" sanringTreeTrigger>src</button>
        <sanring-tree-group>
          <sanring-tree-node value="src/app">
            <button type="button" tabindex="-1" sanringTreeTrigger>app</button>
            <sanring-tree-group>
              <sanring-tree-node value="src/app/app.component.ts">
                <button
                  type="button"
                  tabindex="-1"
                  (click)="tree.selectNode('src/app/app.component.ts')"
                >
                  app.component.ts
                </button>
              </sanring-tree-node>
            </sanring-tree-group>
          </sanring-tree-node>

          <sanring-tree-node value="src/styles.css">
            <button type="button" tabindex="-1" (click)="tree.selectNode('src/styles.css')">
              styles.css
            </button>
          </sanring-tree-node>
        </sanring-tree-group>
      </sanring-tree-node>

      <sanring-tree-node value="package.json">
        <button type="button" tabindex="-1" (click)="tree.selectNode('package.json')">
          package.json
        </button>
      </sanring-tree-node>
    </sanring-tree>
  `,
})
class TreeTestHost {
  readonly expandedValue = signal<string[]>(['src']);
  readonly selectedValue = signal<string | null>('src/styles.css');
}

describe('TreeComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreeTestHost],
    }).compileComponents();
  });

  async function createFixture() {
    const fixture = TestBed.createComponent(TreeTestHost);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture;
  }

  function treeItems(root: HTMLElement) {
    return Array.from(root.querySelectorAll<HTMLElement>('[role="treeitem"]'));
  }

  function itemByValue(root: HTMLElement, value: string) {
    const item = root.querySelector<HTMLElement>(`[role="treeitem"][value="${value}"]`);
    if (!item) throw new Error(`Expected tree item with value "${value}"`);
    return item;
  }

  it('renders tree roles, selection state, and roving tabindex', async () => {
    const fixture = await createFixture();
    const root = fixture.nativeElement as HTMLElement;
    const tree = root.querySelector('[role="tree"]') as HTMLElement;
    const src = itemByValue(root, 'src');
    const app = itemByValue(root, 'src/app');
    const styles = itemByValue(root, 'src/styles.css');
    const packageJson = itemByValue(root, 'package.json');

    expect(tree).toBeTruthy();
    expect(src.getAttribute('aria-expanded')).toBe('true');
    expect(app.getAttribute('aria-expanded')).toBe('false');
    expect(styles.getAttribute('aria-expanded')).toBeNull();
    expect(styles.getAttribute('aria-selected')).toBe('true');
    expect(styles.getAttribute('tabindex')).toBe('0');
    expect(packageJson.getAttribute('tabindex')).toBe('-1');
  });

  it('toggles a node with sanringTreeTrigger and shows or hides its group', async () => {
    const fixture = await createFixture();
    const root = fixture.nativeElement as HTMLElement;
    const host = fixture.componentInstance;
    const src = itemByValue(root, 'src');
    const srcTrigger = src.querySelector('button') as HTMLButtonElement;

    expect(root.querySelector('[role="group"]')).toBeTruthy();

    srcTrigger.click();
    fixture.detectChanges();

    expect(host.expandedValue()).toEqual([]);
    expect(src.getAttribute('aria-expanded')).toBe('false');
    expect(root.querySelector('[role="group"]')).toBeNull();

    srcTrigger.click();
    fixture.detectChanges();

    expect(host.expandedValue()).toEqual(['src']);
    expect(src.getAttribute('aria-expanded')).toBe('true');
    expect(root.querySelector('[role="group"]')).toBeTruthy();
  });

  it('selects a leaf node when its row action is clicked', async () => {
    const fixture = await createFixture();
    const root = fixture.nativeElement as HTMLElement;
    const host = fixture.componentInstance;
    const packageJson = itemByValue(root, 'package.json');
    const packageJsonButton = packageJson.querySelector('button') as HTMLButtonElement;

    packageJsonButton.click();
    fixture.detectChanges();

    expect(host.selectedValue()).toBe('package.json');
    expect(packageJson.getAttribute('aria-selected')).toBe('true');
    expect(itemByValue(root, 'src/styles.css').getAttribute('aria-selected')).toBe('false');
  });

  it('moves focus with arrow keys and activates the focused node with Enter', async () => {
    const fixture = await createFixture();
    const root = fixture.nativeElement as HTMLElement;
    const host = fixture.componentInstance;
    const styles = itemByValue(root, 'src/styles.css');
    const packageJson = itemByValue(root, 'package.json');

    styles.focus();
    fixture.detectChanges();

    expect(document.activeElement).toBe(styles);

    styles.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();

    expect(document.activeElement).toBe(packageJson);
    expect(packageJson.getAttribute('tabindex')).toBe('0');

    packageJson.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();

    expect(host.selectedValue()).toBe('package.json');
    expect(packageJson.getAttribute('aria-selected')).toBe('true');
  });
});

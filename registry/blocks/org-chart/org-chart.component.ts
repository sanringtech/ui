import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  model,
  resource,
  signal,
  viewChild,
} from '@angular/core';
import { SANRING_AVATAR_IMPORTS } from '../avatar';
import { BadgeDirective } from '../badge';
import { ButtonDirective } from '../button';
import { SkeletonDirective } from '../skeleton';
import { SANRING_TREE_IMPORTS } from '../tree';
import {
  createOrgLayoutEngine,
  layoutOrg,
  orgEdgePath,
  type OrgEdge,
  type OrgLayout,
  type OrgLayoutEngine,
} from './layout';

export interface OrgPerson {
  id: string;
  name: string;
  title?: string;
  department?: string;
  avatarUrl?: string;
}

/** `solid` = line manager, `dotted` = matrix / dotted-line reporting. */
export type OrgLink = OrgEdge;

interface OrgTreeNode {
  id: string;
  person: OrgPerson;
  children: OrgTreeNode[];
}

@Component({
  selector: 'sanring-org-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgTemplateOutlet,
    SANRING_AVATAR_IMPORTS,
    BadgeDirective,
    ButtonDirective,
    SkeletonDirective,
    SANRING_TREE_IMPORTS,
  ],
  host: {
    class:
      'flex min-h-0 overflow-hidden rounded-[var(--sanring-radius-lg)] border border-[var(--sanring-border)] bg-[var(--sanring-background)]',
  },
  template: `
    @if (showTree()) {
      <aside
        class="hidden w-56 shrink-0 flex-col gap-2 overflow-auto border-r border-[var(--sanring-border)] p-3 sm:flex"
        aria-label="Organization directory"
      >
        <p class="m-0 px-1 text-xs font-medium uppercase tracking-wide text-[var(--sanring-muted)]">
          Directory
        </p>
        <sanring-tree
          class="min-h-0"
          ariaLabel="People"
          [selectedValue]="selected()"
          (selectedValueChange)="onTreeSelection($event)"
          [(expandedValue)]="treeExpanded"
        >
          <ng-template #treeNode let-node>
            <sanring-tree-node [value]="node.id">
              <button
                type="button"
                tabindex="-1"
                class="flex w-full items-center gap-2 rounded-[var(--sanring-radius-sm)] px-2 py-1.5 text-left text-sm text-[var(--sanring-foreground)] hover:bg-[var(--sanring-surface)]"
                [class.bg-[var(--sanring-surface-strong)]]="node.id === selected()"
                (click)="onTreeSelection(node.id)"
              >
                <span class="min-w-0 flex-1 truncate">{{ node.person.name }}</span>
              </button>
              @if (node.children.length > 0) {
                <sanring-tree-group>
                  @for (child of node.children; track child.id) {
                    <ng-container *ngTemplateOutlet="treeNode; context: { $implicit: child }" />
                  }
                </sanring-tree-group>
              }
            </sanring-tree-node>
          </ng-template>
          @for (root of treeRoots(); track root.id) {
            <ng-container *ngTemplateOutlet="treeNode; context: { $implicit: root }" />
          }
        </sanring-tree>
      </aside>
    }

    <div class="flex min-h-0 min-w-0 flex-1 flex-col">
      <div
        class="flex shrink-0 flex-wrap items-center gap-2 border-b border-[var(--sanring-border)] px-3 py-2"
      >
        <button type="button" sanringBtn variant="outline" size="sm" (click)="zoomBy(1 / 1.15)">
          −
        </button>
        <button type="button" sanringBtn variant="outline" size="sm" (click)="zoomBy(1.15)">
          +
        </button>
        <button type="button" sanringBtn variant="outline" size="sm" (click)="fitToView()">
          Fit
        </button>
        <span class="text-xs tabular-nums text-[var(--sanring-muted)]">
          {{ zoomPercent() }}%
        </span>
      </div>

      @if (layout.error()) {
        <div role="alert" class="p-6 text-sm text-[var(--sanring-error-40)]">
          Could not lay out the org chart.
        </div>
      } @else if (people().length === 0) {
        <div class="p-6 text-sm text-[var(--sanring-muted)]">No people to show.</div>
      } @else if (chart(); as c) {
        <div
          #viewport
          class="relative min-h-0 flex-1 cursor-grab touch-none overflow-hidden bg-[var(--sanring-background)] active:cursor-grabbing"
          (wheel)="onWheel($event)"
          (pointerdown)="onPointerDown($event)"
          (pointermove)="onPointerMove($event)"
          (pointerup)="onPointerUp($event)"
          (pointercancel)="onPointerUp($event)"
        >
          <div
            class="absolute left-0 top-0 origin-top-left will-change-transform"
            [style.transform]="
              'translate(' + panX() + 'px, ' + panY() + 'px) scale(' + zoom() + ')'
            "
            [style.width.px]="c.width"
            [style.height.px]="c.height"
          >
            <svg
              class="pointer-events-none absolute inset-0 overflow-visible"
              [attr.width]="c.width"
              [attr.height]="c.height"
              aria-hidden="true"
            >
              @for (edge of c.edges; track edge.id) {
                <path
                  [attr.d]="edge.d"
                  fill="none"
                  stroke-width="1.5"
                  [attr.stroke]="
                    edge.kind === 'dotted' ? 'var(--sanring-primary)' : 'var(--sanring-border-strong)'
                  "
                  [attr.stroke-dasharray]="edge.kind === 'dotted' ? '4 4' : null"
                />
              }
            </svg>
            @for (node of c.nodes; track node.id) {
              <button
                type="button"
                class="absolute flex items-center gap-3 rounded-[var(--sanring-radius)] border border-[var(--sanring-border)] bg-[var(--sanring-surface)] px-3 text-left text-[var(--sanring-foreground)] shadow-sm transition-colors hover:bg-[var(--sanring-surface-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sanring-border-strong)] data-[selected=true]:border-[var(--sanring-primary)] data-[selected=true]:ring-1 data-[selected=true]:ring-[var(--sanring-primary)]"
                [attr.data-org-card]="node.id"
                [style.left.px]="node.x"
                [style.top.px]="node.y"
                [style.width.px]="node.width"
                [style.height.px]="node.height"
                [attr.data-selected]="node.id === selected()"
                [attr.aria-pressed]="node.id === selected()"
                (click)="selected.set(node.id)"
              >
                <sanring-avatar size="sm">
                  @if (node.person.avatarUrl) {
                    <img sanringAvatarImage [src]="node.person.avatarUrl" alt="" />
                  }
                  <sanring-avatar-fallback>{{ initials(node.person.name) }}</sanring-avatar-fallback>
                </sanring-avatar>
                <span class="min-w-0 flex-1">
                  <span class="block truncate text-sm font-medium">{{ node.person.name }}</span>
                  @if (node.person.title) {
                    <span class="block truncate text-xs text-[var(--sanring-muted)]">{{
                      node.person.title
                    }}</span>
                  }
                </span>
                @if (node.person.department) {
                  <span sanringBadge variant="secondary" class="shrink-0">{{
                    node.person.department
                  }}</span>
                }
              </button>
            }
          </div>
        </div>
      } @else {
        <div
          class="flex flex-col items-center gap-6 p-6"
          aria-busy="true"
          aria-label="Loading org chart"
        >
          <div sanringSkeleton class="h-16 w-56"></div>
          <div class="flex gap-6">
            <div sanringSkeleton class="h-16 w-56"></div>
            <div sanringSkeleton class="h-16 w-56"></div>
            <div sanringSkeleton class="h-16 w-56"></div>
          </div>
        </div>
      }
    </div>
  `,
})
export class OrgChartComponent {
  readonly people = input.required<readonly OrgPerson[]>();
  readonly links = input.required<readonly OrgLink[]>();
  readonly nodeWidth = input(240);
  readonly nodeHeight = input(64);
  /** When false, only the chart viewport is shown (no directory tree). */
  readonly showTree = input(true);
  /** Id of the highlighted person. */
  readonly selected = model<string | null>(null);

  protected readonly zoom = signal(1);
  protected readonly panX = signal(0);
  protected readonly panY = signal(0);
  protected readonly zoomPercent = computed(() => Math.round(this.zoom() * 100));
  protected readonly treeExpanded = linkedSignal(() => this.defaultExpandedIds());

  private readonly viewport = viewChild<ElementRef<HTMLElement>>('viewport');
  private engine?: OrgLayoutEngine & { terminateWorker?: () => void };
  private dragging = false;
  private dragPointerId: number | null = null;
  private lastPointerX = 0;
  private lastPointerY = 0;
  private didInitialFit = false;
  private focusAfterSelect = false;

  protected readonly layout = resource({
    params: () => ({
      people: this.people(),
      links: this.links(),
      nodeWidth: this.nodeWidth(),
      nodeHeight: this.nodeHeight(),
    }),
    loader: ({ params }) => {
      this.engine ??= createOrgLayoutEngine();
      return layoutOrg(this.engine, params.people, params.links, params);
    },
  });

  // Keep showing the previous layout while a new one is computed, so editing
  // the data does not flash the loading skeleton.
  private readonly lastLayout = linkedSignal<OrgLayout | undefined, OrgLayout | undefined>({
    source: () => this.layout.value(),
    computation: (next, previous) => next ?? previous?.value,
  });

  protected readonly chart = computed(() => {
    const layout = this.lastLayout();
    if (!layout) return undefined;
    const byId = new Map(this.people().map((person) => [person.id, person]));
    return {
      width: layout.width,
      height: layout.height,
      nodes: layout.nodes.flatMap((node) => {
        const person = byId.get(node.id);
        return person ? [{ ...node, person }] : [];
      }),
      edges: layout.edges.map((edge) => ({
        id: edge.id,
        kind: edge.kind,
        d: orgEdgePath(edge.points),
      })),
    };
  });

  /** Solid-line reporting tree for keyboard navigation (first parent wins on dual managers). */
  protected readonly treeRoots = computed(() => this.buildTree());

  constructor() {
    inject(DestroyRef).onDestroy(() => this.engine?.terminateWorker?.());

    effect(() => {
      const chart = this.chart();
      const vp = this.viewport();
      if (!chart || !vp || this.didInitialFit) return;
      requestAnimationFrame(() => {
        if (this.didInitialFit) return;
        this.fitToView();
        this.didInitialFit = true;
      });
    });

    effect(() => {
      const id = this.selected();
      if (!id || !this.focusAfterSelect) return;
      this.focusAfterSelect = false;
      queueMicrotask(() => this.focusCard(id));
    });
  }

  protected onTreeSelection(id: string | null): void {
    if (!id) {
      this.selected.set(null);
      return;
    }
    this.focusAfterSelect = true;
    this.selected.set(id);
    this.scrollToNode(id);
  }

  protected zoomBy(factor: number): void {
    this.zoom.set(clampZoom(this.zoom() * factor));
  }

  fitToView(): void {
    const chart = this.chart();
    const el = this.viewport()?.nativeElement;
    if (!chart || !el || chart.width <= 0 || chart.height <= 0) return;
    const pad = 24;
    const scale = Math.min(
      (el.clientWidth - pad) / chart.width,
      (el.clientHeight - pad) / chart.height,
      1,
    );
    this.zoom.set(clampZoom(scale));
    this.panX.set((el.clientWidth - chart.width * scale) / 2);
    this.panY.set((el.clientHeight - chart.height * scale) / 2);
  }

  scrollToNode(id: string): void {
    const chart = this.chart();
    const el = this.viewport()?.nativeElement;
    const node = chart?.nodes.find((item) => item.id === id);
    if (!chart || !el || !node) return;
    const z = this.zoom();
    this.panX.set(el.clientWidth / 2 - (node.x + node.width / 2) * z);
    this.panY.set(el.clientHeight / 2 - (node.y + node.height / 2) * z);
  }

  protected onWheel(event: WheelEvent): void {
    event.preventDefault();
    const factor = event.deltaY > 0 ? 1 / 1.08 : 1.08;
    const el = this.viewport()?.nativeElement;
    if (!el) {
      this.zoomBy(factor);
      return;
    }
    const rect = el.getBoundingClientRect();
    const mx = event.clientX - rect.left;
    const my = event.clientY - rect.top;
    const prev = this.zoom();
    const next = clampZoom(prev * factor);
    const worldX = (mx - this.panX()) / prev;
    const worldY = (my - this.panY()) / prev;
    this.zoom.set(next);
    this.panX.set(mx - worldX * next);
    this.panY.set(my - worldY * next);
  }

  protected onPointerDown(event: PointerEvent): void {
    if (event.button !== 0) return;
    if ((event.target as HTMLElement | null)?.closest?.('[data-org-card]')) return;
    const el = this.viewport()?.nativeElement;
    if (!el) return;
    this.dragging = true;
    this.dragPointerId = event.pointerId;
    this.lastPointerX = event.clientX;
    this.lastPointerY = event.clientY;
    el.setPointerCapture(event.pointerId);
  }

  protected onPointerMove(event: PointerEvent): void {
    if (!this.dragging || event.pointerId !== this.dragPointerId) return;
    const dx = event.clientX - this.lastPointerX;
    const dy = event.clientY - this.lastPointerY;
    this.lastPointerX = event.clientX;
    this.lastPointerY = event.clientY;
    this.panX.update((x) => x + dx);
    this.panY.update((y) => y + dy);
  }

  protected onPointerUp(event: PointerEvent): void {
    if (event.pointerId !== this.dragPointerId) return;
    this.dragging = false;
    this.dragPointerId = null;
    try {
      this.viewport()?.nativeElement.releasePointerCapture(event.pointerId);
    } catch {
      // Pointer may already be released.
    }
  }

  protected initials(name: string): string {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]!.toUpperCase())
      .join('');
  }

  private focusCard(id: string): void {
    const card = this.viewport()?.nativeElement.querySelector<HTMLElement>(
      `[data-org-card="${CSS.escape(id)}"]`,
    );
    card?.focus({ preventScroll: true });
  }

  private buildTree(): OrgTreeNode[] {
    const people = this.people();
    const byId = new Map(people.map((person) => [person.id, person]));
    const children = new Map<string, string[]>();
    const parentOf = new Map<string, string>();

    for (const link of this.links()) {
      if ((link.kind ?? 'solid') !== 'solid') continue;
      if (!byId.has(link.source) || !byId.has(link.target)) continue;
      if (parentOf.has(link.target)) continue;
      parentOf.set(link.target, link.source);
      children.set(link.source, [...(children.get(link.source) ?? []), link.target]);
    }

    const build = (id: string): OrgTreeNode | null => {
      const person = byId.get(id);
      if (!person) return null;
      return {
        id,
        person,
        children: (children.get(id) ?? [])
          .map(build)
          .filter((node): node is OrgTreeNode => node !== null),
      };
    };

    return people
      .filter((person) => !parentOf.has(person.id))
      .map((person) => build(person.id))
      .filter((node): node is OrgTreeNode => node !== null);
  }

  private defaultExpandedIds(): string[] {
    const ids: string[] = [];
    const visit = (node: OrgTreeNode) => {
      if (node.children.length === 0) return;
      ids.push(node.id);
      for (const child of node.children) visit(child);
    };
    for (const root of this.buildTree()) visit(root);
    return ids;
  }
}

function clampZoom(value: number): number {
  return Math.min(2.5, Math.max(0.35, value));
}

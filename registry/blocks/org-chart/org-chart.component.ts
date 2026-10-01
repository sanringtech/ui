import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  input,
  linkedSignal,
  model,
  resource,
} from '@angular/core';
import { SANRING_AVATAR_IMPORTS } from '../avatar';
import { BadgeDirective } from '../badge';
import { SkeletonDirective } from '../skeleton';
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

@Component({
  selector: 'sanring-org-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SANRING_AVATAR_IMPORTS, BadgeDirective, SkeletonDirective],
  host: {
    class:
      'block overflow-auto rounded-[var(--sanring-radius-lg)] border border-[var(--sanring-border)] bg-[var(--sanring-background)]',
  },
  template: `
    @if (layout.error()) {
      <div role="alert" class="p-6 text-sm text-[var(--sanring-error-40)]">Could not lay out the org chart.</div>
    } @else if (people().length === 0) {
      <div class="p-6 text-sm text-[var(--sanring-muted)]">No people to show.</div>
    } @else if (chart(); as c) {
      <div class="relative" [style.width.px]="c.width" [style.height.px]="c.height">
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
              [attr.stroke]="edge.kind === 'dotted' ? 'var(--sanring-primary)' : 'var(--sanring-border-strong)'"
              [attr.stroke-dasharray]="edge.kind === 'dotted' ? '4 4' : null"
            />
          }
        </svg>
        @for (node of c.nodes; track node.id) {
          <button
            type="button"
            class="absolute flex items-center gap-3 rounded-[var(--sanring-radius)] border border-[var(--sanring-border)] bg-[var(--sanring-surface)] px-3 text-left text-[var(--sanring-foreground)] shadow-sm transition-colors hover:bg-[var(--sanring-surface-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sanring-border-strong)] data-[selected=true]:border-[var(--sanring-primary)] data-[selected=true]:ring-1 data-[selected=true]:ring-[var(--sanring-primary)]"
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
                <span class="block truncate text-xs text-[var(--sanring-muted)]">{{ node.person.title }}</span>
              }
            </span>
            @if (node.person.department) {
              <span sanringBadge variant="secondary" class="shrink-0">{{ node.person.department }}</span>
            }
          </button>
        }
      </div>
    } @else {
      <div class="flex flex-col items-center gap-6 p-6" aria-busy="true" aria-label="Loading org chart">
        <div sanringSkeleton class="h-16 w-56"></div>
        <div class="flex gap-6">
          <div sanringSkeleton class="h-16 w-56"></div>
          <div sanringSkeleton class="h-16 w-56"></div>
          <div sanringSkeleton class="h-16 w-56"></div>
        </div>
      </div>
    }
  `,
})
export class OrgChartComponent {
  readonly people = input.required<readonly OrgPerson[]>();
  readonly links = input.required<readonly OrgLink[]>();
  readonly nodeWidth = input(240);
  readonly nodeHeight = input(64);
  /** Id of the highlighted person. */
  readonly selected = model<string | null>(null);

  private engine?: OrgLayoutEngine & { terminateWorker?: () => void };

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
      edges: layout.edges.map((edge) => ({ id: edge.id, kind: edge.kind, d: orgEdgePath(edge.points) })),
    };
  });

  constructor() {
    inject(DestroyRef).onDestroy(() => this.engine?.terminateWorker?.());
  }

  protected initials(name: string): string {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]!.toUpperCase())
      .join('');
  }
}

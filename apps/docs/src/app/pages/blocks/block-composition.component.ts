import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocsComponentId } from '../../navigation/docs-navigation';

@Component({
  selector: 'app-block-composition',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="grid gap-4">
      <ul class="m-0 flex list-none flex-wrap gap-2 p-0" [attr.aria-label]="componentsLabel()">
        @for (dep of componentDeps(); track dep) {
          <li>
            <a
              class="inline-flex items-center rounded-[var(--sanring-radius-sm)] border border-[var(--docs-border)] bg-[var(--docs-surface)] px-2.5 py-1 font-mono text-xs font-medium text-[var(--docs-fg)] no-underline transition-colors hover:border-[var(--docs-border-strong)] hover:bg-[var(--docs-elevated)]"
              [routerLink]="'/components/' + dep"
            >
              {{ dep }}
            </a>
          </li>
        }
      </ul>

      @if (peerEntries().length > 0) {
        <div>
          <p class="m-0 mb-2 text-xs font-medium uppercase tracking-wide text-[var(--docs-muted)]">
            {{ peersLabel() }}
          </p>
          <ul class="m-0 flex list-none flex-wrap gap-2 p-0">
            @for (peer of peerEntries(); track peer.name) {
              <li
                class="inline-flex items-center gap-1.5 rounded-[var(--sanring-radius-sm)] border border-[var(--docs-border)] bg-[var(--docs-panel)] px-2.5 py-1 font-mono text-xs text-[var(--docs-fg)]"
              >
                <span>{{ peer.name }}</span>
                <span class="text-[var(--docs-muted)]">{{ peer.version }}</span>
              </li>
            }
          </ul>
        </div>
      }
    </div>
  `,
})
export class BlockCompositionComponent {
  readonly componentDeps = input.required<readonly DocsComponentId[]>();
  readonly peerDependencies = input<Readonly<Record<string, string>> | undefined>();
  readonly componentsLabel = input('Built from');
  readonly peersLabel = input('Peer dependencies');

  protected readonly peerEntries = () =>
    Object.entries(this.peerDependencies() ?? {}).map(([name, version]) => ({ name, version }));
}

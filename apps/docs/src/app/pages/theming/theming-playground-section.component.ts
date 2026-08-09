import { Component, computed, inject, input, signal } from '@angular/core';
import { LucideClipboard } from '@lucide/angular';
import { ToastService } from '@sanring/ui';
import { ComponentPageSectionDefinition } from '../../docs-schema/component-page.types';
import { I18nService } from '../../i18n/i18n.service';
import {
  ComponentPageCodeBlock,
  ComponentPageSectionComponent,
} from '../../layouts/component-page';

type ThemePlaygroundMode = 'light' | 'dark';
type ThemeColorKey = 'accent' | 'background' | 'surface' | 'foreground' | 'border';

interface ThemeColorControl {
  key: ThemeColorKey;
  label: string;
  value: () => string;
}

@Component({
  selector: 'app-theming-playground-section',
  standalone: true,
  imports: [ComponentPageCodeBlock, ComponentPageSectionComponent, LucideClipboard],
  template: `
    <app-component-page-section [section]="section()">
      <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
        {{ i18n.t('theming.playground.body') }}
      </p>

      <div class="mt-6 grid min-w-0 gap-4 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
        <div
          class="grid gap-4 rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-surface)] p-4"
        >
          <div
            class="grid grid-cols-2 gap-2 rounded-[var(--sanring-radius-sm)] bg-[var(--docs-elevated)] p-1"
          >
            @for (mode of playgroundModes; track mode.value) {
              <button
                type="button"
                class="rounded-[var(--sanring-radius-sm)] px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--docs-border-strong)]"
                [class]="
                  playgroundMode() === mode.value
                    ? 'bg-[var(--docs-panel)] text-[var(--docs-fg)] shadow-sm'
                    : 'text-[var(--docs-muted)] hover:text-[var(--docs-fg)]'
                "
                (click)="playgroundMode.set(mode.value)"
              >
                {{ mode.label }}
              </button>
            }
          </div>

          <div class="grid gap-3">
            @for (control of colorControls; track control.key) {
              <label class="grid gap-1.5">
                <span class="text-sm font-medium text-[var(--docs-fg)]">{{ control.label }}</span>
                <span class="flex min-w-0 items-center gap-2">
                  <input
                    type="color"
                    class="h-9 w-12 shrink-0 cursor-pointer rounded-[var(--sanring-radius-sm)] border border-[var(--docs-border)] bg-transparent p-1"
                    [value]="control.value()"
                    (input)="updateColor(control.key, $event)"
                  />
                  <code
                    class="min-w-0 flex-1 rounded-[var(--sanring-radius-sm)] border border-[var(--docs-border)] bg-[var(--docs-code)] px-2.5 py-1.5 font-mono text-sm text-[var(--docs-code-fg)]"
                  >
                    {{ control.value() }}
                  </code>
                </span>
              </label>
            }

            <label class="grid gap-1.5">
              <span
                class="flex items-center justify-between gap-3 text-sm font-medium text-[var(--docs-fg)]"
              >
                <span>{{ i18n.t('theming.playground.radius') }}</span>
                <code class="font-mono text-[var(--docs-muted)]">{{ playgroundRadius() }}px</code>
              </span>
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                class="h-8 accent-[var(--docs-accent)]"
                [value]="playgroundRadius()"
                (input)="updateRadius($event)"
              />
            </label>
          </div>

          <button
            type="button"
            class="inline-flex h-9 items-center justify-center gap-2 rounded-[var(--sanring-radius-sm)] bg-[var(--docs-control)] px-3 text-sm font-medium text-[var(--docs-control-fg)] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--docs-border-strong)]"
            (click)="copyPlaygroundCss()"
          >
            <svg lucideClipboard class="size-4"></svg>
            <span>{{ i18n.t('theming.playground.copy') }}</span>
          </button>
        </div>

        <div
          class="min-w-0 overflow-hidden rounded-[var(--playground-radius-lg)] border border-[var(--playground-border)] bg-[var(--playground-background)] text-[var(--playground-foreground)]"
          [style.--playground-accent]="playgroundAccent()"
          [style.--playground-background]="playgroundBackground()"
          [style.--playground-surface]="playgroundSurface()"
          [style.--playground-foreground]="playgroundForeground()"
          [style.--playground-muted]="playgroundMuted()"
          [style.--playground-border]="playgroundBorder()"
          [style.--playground-radius]="playgroundRadiusCss()"
          [style.--playground-radius-lg]="playgroundRadiusLgCss()"
        >
          <div
            class="border-b border-[var(--playground-border)] bg-[var(--playground-surface)] px-4 py-3"
          >
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div class="min-w-0">
                <p class="m-0 text-sm font-semibold">
                  {{ i18n.t('theming.playground.previewTitle') }}
                </p>
                <p class="m-0 mt-1 text-sm text-[var(--playground-muted)]">
                  {{ i18n.t('theming.playground.previewDescription') }}
                </p>
              </div>
              <span
                class="rounded-[var(--playground-radius)] px-2.5 py-1 text-xs font-medium"
                style="background: color-mix(in srgb, var(--playground-accent) 18%, transparent); color: var(--playground-accent)"
              >
                Beta
              </span>
            </div>
          </div>

          <div class="grid gap-4 p-4 sm:grid-cols-[minmax(0,1fr)_minmax(180px,220px)]">
            <div class="grid min-w-0 gap-3">
              <div
                class="rounded-[var(--playground-radius-lg)] border border-[var(--playground-border)] bg-[var(--playground-surface)] p-4"
              >
                <div class="mb-3 flex items-center justify-between gap-3">
                  <p class="m-0 text-sm font-medium">
                    {{ i18n.t('theming.playground.cardTitle') }}
                  </p>
                  <span
                    class="size-2 rounded-full"
                    style="background: var(--playground-accent)"
                  ></span>
                </div>
                <p class="m-0 text-sm leading-6 text-[var(--playground-muted)]">
                  {{ i18n.t('theming.playground.cardBody') }}
                </p>
                <div class="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    class="rounded-[var(--playground-radius)] px-3 py-2 text-sm font-medium text-white"
                    style="background: var(--playground-accent)"
                  >
                    Primary
                  </button>
                  <button
                    type="button"
                    class="rounded-[var(--playground-radius)] border border-[var(--playground-border)] bg-transparent px-3 py-2 text-sm font-medium"
                  >
                    Secondary
                  </button>
                </div>
              </div>

              <div
                class="overflow-hidden rounded-[var(--playground-radius-lg)] border border-[var(--playground-border)] bg-[var(--playground-surface)]"
              >
                <div
                  class="flex items-center gap-2 border-b border-[var(--playground-border)] px-3 py-2"
                >
                  <span
                    class="size-2 rounded-full"
                    style="background: var(--playground-accent)"
                  ></span>
                  <span class="text-xs font-medium text-[var(--playground-muted)]">theme.css</span>
                </div>
                <pre
                  class="m-0 overflow-x-auto px-3 py-3 font-mono text-xs leading-5"
                ><code>--sanring-primary: {{ playgroundAccent() }};
--sanring-background: {{ playgroundBackground() }};
--sanring-surface: {{ playgroundSurface() }};</code></pre>
              </div>
            </div>

            <div
              class="grid content-start gap-3 rounded-[var(--playground-radius-lg)] border border-[var(--playground-border)] bg-[var(--playground-surface)] p-4"
            >
              <label class="grid gap-1.5">
                <span class="text-xs font-medium text-[var(--playground-muted)]">Email</span>
                <input
                  value="hello@sanring.dev"
                  class="h-9 min-w-0 rounded-[var(--playground-radius)] border border-[var(--playground-border)] bg-[var(--playground-background)] px-3 text-sm text-[var(--playground-foreground)] outline-none"
                  readonly
                />
              </label>
              <div class="h-2 overflow-hidden rounded-full bg-[var(--playground-background)]">
                <div
                  class="h-full w-2/3 rounded-full"
                  style="background: var(--playground-accent)"
                ></div>
              </div>
              <p class="m-0 text-xs leading-5 text-[var(--playground-muted)]">
                {{ i18n.t('theming.playground.formNote') }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        class="mt-4 overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]"
      >
        <div
          class="flex items-center gap-2 border-b border-[var(--docs-border)] bg-[var(--docs-surface)] px-4 py-2.5"
        >
          <span class="text-xs font-medium text-[var(--docs-muted)]">CSS</span>
        </div>
        <app-component-page-code-block [code]="playgroundCss()" language="css" />
      </div>
    </app-component-page-section>
  `,
})
export class ThemingPlaygroundSectionComponent {
  readonly section = input.required<ComponentPageSectionDefinition>();

  protected readonly i18n = inject(I18nService);
  private readonly toast = inject(ToastService);

  protected readonly playgroundModes: readonly { value: ThemePlaygroundMode; label: string }[] = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
  ];
  protected readonly playgroundMode = signal<ThemePlaygroundMode>('light');
  protected readonly playgroundAccent = signal('#6fa9b1');
  protected readonly playgroundLightBackground = signal('#f6f8f8');
  protected readonly playgroundLightSurface = signal('#ffffff');
  protected readonly playgroundLightForeground = signal('#202424');
  protected readonly playgroundLightBorder = signal('#d9e1e2');
  protected readonly playgroundDarkBackground = signal('#202424');
  protected readonly playgroundDarkSurface = signal('#232a2b');
  protected readonly playgroundDarkForeground = signal('#edf1f2');
  protected readonly playgroundDarkBorder = signal('#354042');
  protected readonly playgroundRadius = signal(8);

  protected readonly playgroundBackground = computed(() =>
    this.playgroundMode() === 'light'
      ? this.playgroundLightBackground()
      : this.playgroundDarkBackground(),
  );
  protected readonly playgroundSurface = computed(() =>
    this.playgroundMode() === 'light'
      ? this.playgroundLightSurface()
      : this.playgroundDarkSurface(),
  );
  protected readonly playgroundForeground = computed(() =>
    this.playgroundMode() === 'light'
      ? this.playgroundLightForeground()
      : this.playgroundDarkForeground(),
  );
  protected readonly playgroundBorder = computed(() =>
    this.playgroundMode() === 'light' ? this.playgroundLightBorder() : this.playgroundDarkBorder(),
  );
  protected readonly playgroundMuted = computed(() =>
    this.playgroundMode() === 'light' ? '#647477' : '#a8b8bb',
  );
  protected readonly playgroundRadiusCss = computed(() => `${this.playgroundRadius()}px`);
  protected readonly playgroundRadiusLgCss = computed(() => `${this.playgroundRadius() + 4}px`);
  protected readonly colorControls = [
    {
      key: 'accent',
      label: 'Accent',
      value: this.playgroundAccent,
    },
    {
      key: 'background',
      label: 'Background',
      value: this.playgroundBackground,
    },
    {
      key: 'surface',
      label: 'Surface',
      value: this.playgroundSurface,
    },
    {
      key: 'foreground',
      label: 'Foreground',
      value: this.playgroundForeground,
    },
    {
      key: 'border',
      label: 'Border',
      value: this.playgroundBorder,
    },
  ] satisfies readonly ThemeColorControl[];

  protected readonly playgroundCss = computed(() => {
    const selector = this.playgroundMode() === 'light' ? ":root[data-theme='light']" : ':root';

    return `${selector} {
  --sanring-primary: ${this.playgroundAccent()};
  --sanring-background: ${this.playgroundBackground()};
  --sanring-foreground: ${this.playgroundForeground()};
  --sanring-surface: ${this.playgroundSurface()};
  --sanring-elevated: ${this.playgroundSurface()};
  --sanring-border: ${this.playgroundBorder()};
  --sanring-radius: ${this.playgroundRadiusCss()};
  --sanring-radius-lg: ${this.playgroundRadiusLgCss()};
}`;
  });

  protected updateColor(key: ThemeColorKey, event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const value = input?.value;
    if (!value) return;

    switch (key) {
      case 'accent':
        this.playgroundAccent.set(value);
        break;
      case 'background':
        this.currentBackgroundSignal().set(value);
        break;
      case 'surface':
        this.currentSurfaceSignal().set(value);
        break;
      case 'foreground':
        this.currentForegroundSignal().set(value);
        break;
      case 'border':
        this.currentBorderSignal().set(value);
        break;
    }
  }

  protected updateRadius(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const radius = Number(input?.value);
    if (Number.isFinite(radius)) {
      this.playgroundRadius.set(radius);
    }
  }

  protected async copyPlaygroundCss(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.playgroundCss());
      this.toast.show({
        type: 'success',
        title: this.i18n.t('actions.copied'),
        duration: 2000,
        closable: false,
      });
    } catch {
      this.toast.show({
        type: 'error',
        title: this.i18n.t('actions.copyFailed'),
        duration: 3000,
        closable: true,
      });
    }
  }

  private currentBackgroundSignal() {
    return this.playgroundMode() === 'light'
      ? this.playgroundLightBackground
      : this.playgroundDarkBackground;
  }

  private currentSurfaceSignal() {
    return this.playgroundMode() === 'light'
      ? this.playgroundLightSurface
      : this.playgroundDarkSurface;
  }

  private currentForegroundSignal() {
    return this.playgroundMode() === 'light'
      ? this.playgroundLightForeground
      : this.playgroundDarkForeground;
  }

  private currentBorderSignal() {
    return this.playgroundMode() === 'light'
      ? this.playgroundLightBorder
      : this.playgroundDarkBorder;
  }
}

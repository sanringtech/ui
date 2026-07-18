import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ButtonDirective, SANRING_TOAST_IMPORTS, ToastPosition, ToastService } from '@sanring/ui';
import { getComponentPageSection } from '../../../docs-schema/component-page.utils';
import { I18nService } from '../../../i18n/i18n.service';
import {
  ComponentPageApiTableComponent,
  ComponentPageCodeBlock,
  ComponentPageCodePreviewer,
  ComponentPageComponent,
  ComponentPageHeaderComponent,
  ComponentPageInstallationComponent,
  ComponentPageUsageImportsComponent,
  ComponentPageSectionComponent,
} from '../../../layouts/component-page';
import { toastPage, toastPageExamples } from './toast.docs';

/**
 * 每個位置 Demo 有自己獨立的 ToastService 實例（透過 providers: [ToastService]），
 * 確保各位置的 toast 互相隔離，不共用同一個 queue。
 */
@Component({
  selector: 'app-toast-position-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ToastService],
  imports: [SANRING_TOAST_IMPORTS, ButtonDirective],
  template: `
    <!-- 每個 demo 有自己的 toaster，注入到本地隔離的 ToastService -->
    <sanring-toaster [position]="position()" [maxToasts]="2" />
    <button sanringBtn type="button" size="sm" variant="outline" class="w-full" (click)="trigger()">
      {{ label() }}
    </button>
  `,
})
export class ToastPositionDemoComponent {
  readonly position = input.required<ToastPosition>();
  readonly label = input.required<string>();

  private readonly toast = inject(ToastService);

  trigger(): void {
    this.toast.info(this.position(), { description: 'Toast shown here', duration: 3000 });
  }
}

// ---------------------------------------------------------------------------

@Component({
  selector: 'app-toast-page',
  // ToastService 移除 providedIn:'root'，消費端必須明確 provide。
  // 全域 toast（basic / variant / action demo）由此層提供。
  providers: [ToastService],
  imports: [
    ButtonDirective,
    ComponentPageApiTableComponent,
    ComponentPageCodeBlock,
    ComponentPageCodePreviewer,
    ComponentPageComponent,
    ComponentPageHeaderComponent,
    ComponentPageInstallationComponent,
    ComponentPageUsageImportsComponent,
    ComponentPageSectionComponent,
    SANRING_TOAST_IMPORTS,
    ToastPositionDemoComponent,
  ],
  template: `
    <!-- 全域 toaster 供 basic / variant / action 範例使用（注入 root ToastService） -->
    <sanring-toaster position="bottom-right" [maxToasts]="3" />

    <app-component-page [sections]="page.sections">
      <app-component-page-header
        [componentId]="page.componentId"
        [title]="i18n.t(page.titleKey)"
        [description]="i18n.t(page.descriptionKey)"
      />

      <!-- Basic -->
      <app-component-page-section [section]="section('basic')">
        <app-component-page-code-previewer [code]="examples.basic" language="angular-html">
          <div previewer class="flex items-center justify-center">
            <button sanringBtn type="button" (click)="showBasic()">
              {{ i18n.t('toast.demo.showToast') }}
            </button>
          </div>
        </app-component-page-code-previewer>
      </app-component-page-section>

      <!-- Usage -->
      <app-component-page-section [section]="section('usage')">
        <div class="grid gap-6">
          <app-component-page-usage-imports
            [code]="examples.usageImport"
            [individualCode]="examples.usageIndividualImports"
          />
          <div
            class="overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]"
          >
            <app-component-page-code-block [code]="examples.usageMain" language="typescript" />
          </div>
        </div>
      </app-component-page-section>

      <!-- Installation -->
      <app-component-page-section [section]="section('installation')">
        <app-component-page-installation
          componentName="toast"
          manualSnippet="import { SANRING_TOAST_IMPORTS, ToastService } from './components/ui/toast';"
        />
      </app-component-page-section>

      <!-- Examples -->
      <app-component-page-section [section]="section('example')">
        <div class="grid gap-2">
          <!-- Variants -->
          <app-component-page-section [section]="section('example-variant')">
            <app-component-page-code-previewer [code]="examples.variant" language="angular-html">
              <div previewer class="flex flex-wrap items-center justify-center gap-3">
                <button sanringBtn type="button" variant="secondary" (click)="showSuccess()">
                  {{ i18n.t('toast.demo.success') }}
                </button>
                <button sanringBtn type="button" variant="destructive" (click)="showError()">
                  {{ i18n.t('toast.demo.error') }}
                </button>
                <button sanringBtn type="button" variant="outline" (click)="showWarning()">
                  {{ i18n.t('toast.demo.warning') }}
                </button>
                <button sanringBtn type="button" variant="ghost" (click)="showInfo()">
                  {{ i18n.t('toast.demo.info') }}
                </button>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <!-- Action -->
          <app-component-page-section [section]="section('example-action')">
            <app-component-page-code-previewer [code]="examples.action" language="typescript">
              <div previewer class="flex items-center justify-center">
                <button sanringBtn type="button" variant="outline" (click)="showAction()">
                  {{ i18n.t('toast.demo.showAction') }}
                </button>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <!-- Position: 6 個獨立 demo，各有自己的 ToastService -->
          <app-component-page-section [section]="section('example-position')">
            <p class="mb-4 text-sm text-[var(--docs-muted)]">
              {{ i18n.t('toast.demo.positionDescription') }}
            </p>
            <app-component-page-code-previewer [code]="examples.position" language="angular-html">
              <div previewer class="grid w-[min(520px,100%)] grid-cols-2 gap-3 sm:grid-cols-3">
                @for (item of positions; track item.value) {
                  <app-toast-position-demo [position]="item.value" [label]="item.label" />
                }
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>
        </div>
      </app-component-page-section>

      <!-- API -->
      <app-component-page-section [section]="section('api')">
        <app-component-page-api-table [rows]="page.apiRows!" />
      </app-component-page-section>
    </app-component-page>
  `,
})
export class ToastPageComponent {
  protected readonly page = toastPage;
  protected readonly examples = toastPageExamples;
  protected readonly i18n = inject(I18nService);
  private readonly toast = inject(ToastService);

  protected readonly positions: readonly { label: string; value: ToastPosition }[] = [
    { label: 'Top left', value: 'top-left' },
    { label: 'Top center', value: 'top-center' },
    { label: 'Top right', value: 'top-right' },
    { label: 'Bottom left', value: 'bottom-left' },
    { label: 'Bottom center', value: 'bottom-center' },
    { label: 'Bottom right', value: 'bottom-right' },
  ];

  protected showBasic() {
    this.toast.success(this.i18n.t('toast.demo.basicTitle'), {
      description: this.i18n.t('toast.demo.basicDescription'),
    });
  }

  protected showSuccess() {
    this.toast.success(this.i18n.t('toast.demo.successTitle'), {
      description: this.i18n.t('toast.demo.successDescription'),
    });
  }

  protected showError() {
    this.toast.error(this.i18n.t('toast.demo.errorTitle'), {
      description: this.i18n.t('toast.demo.errorDescription'),
    });
  }

  protected showWarning() {
    this.toast.warning(this.i18n.t('toast.demo.warningTitle'), {
      description: this.i18n.t('toast.demo.warningDescription'),
    });
  }

  protected showInfo() {
    this.toast.info(this.i18n.t('toast.demo.infoTitle'), {
      description: this.i18n.t('toast.demo.infoDescription'),
    });
  }

  protected showAction() {
    this.toast.info(this.i18n.t('toast.demo.actionTitle'), {
      description: this.i18n.t('toast.demo.actionDescription'),
      duration: 0,
      action: {
        label: this.i18n.t('toast.demo.review'),
        onClick: () => {
          this.toast.success(this.i18n.t('toast.demo.reviewedTitle'));
        },
      },
    });
  }

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }
}

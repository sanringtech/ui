import { Component, inject, signal } from '@angular/core';
import { ButtonDirective, ToasterComponent, ToastPosition, ToastService } from '@sanring/ui';
import { getComponentPageSection } from '../../../docs-schema/component-page.utils';
import { I18nService } from '../../../i18n/i18n.service';
import {
  ComponentPageApiTableComponent,
  ComponentPageCodeBlock,
  ComponentPageCodePreviewer,
  ComponentPageComponent,
  ComponentPageHeaderComponent,
  ComponentPageInstallationComponent,
  ComponentPageSectionComponent,
} from '../../../layouts/component-page';
import { toastPage, toastPageExamples } from './toast.docs';

@Component({
  selector: 'app-toast-page',
  imports: [
    ButtonDirective,
    ComponentPageApiTableComponent,
    ComponentPageCodeBlock,
    ComponentPageCodePreviewer,
    ComponentPageComponent,
    ComponentPageHeaderComponent,
    ComponentPageInstallationComponent,
    ComponentPageSectionComponent,
    ToasterComponent,
  ],
  template: `
    <sanring-toaster [position]="position()" [maxToasts]="3" />

    <app-component-page [sections]="page.sections">
      <app-component-page-header
        [componentId]="page.componentId"
        [title]="i18n.t(page.titleKey)"
        [description]="i18n.t(page.descriptionKey)"
      />

      <app-component-page-section [section]="section('basic')">
        <app-component-page-code-previewer [code]="examples.basic" language="angular-html">
          <div previewer class="flex items-center justify-center">
            <button sanringBtn type="button" (click)="showBasic()">
              {{ i18n.t('toast.demo.showToast') }}
            </button>
          </div>
        </app-component-page-code-previewer>
      </app-component-page-section>

      <app-component-page-section [section]="section('usage')">
        <div class="grid gap-6">
          <div class="overflow-hidden rounded-lg border border-[var(--docs-border)]">
            <app-component-page-code-block [code]="examples.usageImport" language="typescript" />
          </div>
          <div class="overflow-hidden rounded-lg border border-[var(--docs-border)]">
            <app-component-page-code-block [code]="examples.usageMain" language="typescript" />
          </div>
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="section('installation')">
        <app-component-page-installation
          componentName="toast"
          manualSnippet="import { ToasterComponent, ToastService } from '@sanring/ui';"
        />
      </app-component-page-section>

      <app-component-page-section [section]="section('example')">
        <div class="grid gap-2">
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

          <app-component-page-section [section]="section('example-action')">
            <app-component-page-code-previewer [code]="examples.action" language="typescript">
              <div previewer class="flex items-center justify-center">
                <button sanringBtn type="button" variant="outline" (click)="showAction()">
                  {{ i18n.t('toast.demo.showAction') }}
                </button>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-position')">
            <app-component-page-code-previewer [code]="examples.position" language="angular-html">
              <div previewer class="grid w-[min(520px,100%)] gap-4">
                <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  @for (item of positions; track item.value) {
                    <button
                      sanringBtn
                      type="button"
                      size="sm"
                      [variant]="position() === item.value ? 'secondary' : 'outline'"
                      (click)="setPosition(item.value)"
                    >
                      {{ item.label }}
                    </button>
                  }
                </div>
                <p class="m-0 text-center text-sm text-[var(--docs-muted)]">
                  {{ i18n.t('toast.demo.positionDescription') }}
                </p>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>
        </div>
      </app-component-page-section>

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
  protected readonly position = signal<ToastPosition>('bottom-right');
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

  protected setPosition(position: ToastPosition) {
    this.position.set(position);
    this.toast.info(this.i18n.t('toast.demo.positionTitle'), {
      description: position,
    });
  }

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }
}

import { Component, inject, signal } from '@angular/core';
import {
  ButtonDirective,
  FileTriggerDirective,
  FileUploadComponent,
  type ImageCropperComponent,
  SANRING_IMAGE_CROPPER_IMPORTS,
} from '@sanring/ui';
import { getComponentPageSection } from '../../../docs-schema/component-page.utils';
import { I18nService } from '../../../i18n/i18n.service';
import {
  ComponentPageApiTableComponent,
  ComponentPageCodeBlock,
  ComponentPageCodePreviewer,
  ComponentPageComponent,
  ComponentPageHeaderComponent,
  ComponentPageInstallationComponent,
  ComponentPageKeyboardTableComponent,
  ComponentPageUsageImportsComponent,
  ComponentPageSectionComponent,
} from '../../../layouts/component-page';
import { imageCropperPage, imageCropperPageExamples } from './image-cropper.docs';

const RATIOS = [
  { label: 'Free', value: null },
  { label: '1:1', value: 1 },
  { label: '4:3', value: 4 / 3 },
  { label: '16:9', value: 16 / 9 },
] as const;

@Component({
  selector: 'app-image-cropper-page',
  imports: [
    ComponentPageApiTableComponent,
    ComponentPageCodeBlock,
    ComponentPageCodePreviewer,
    ComponentPageComponent,
    ComponentPageHeaderComponent,
    ComponentPageInstallationComponent,
    ComponentPageKeyboardTableComponent,
    ComponentPageUsageImportsComponent,
    ComponentPageSectionComponent,
    ButtonDirective,
    FileTriggerDirective,
    FileUploadComponent,
    SANRING_IMAGE_CROPPER_IMPORTS,
  ],
  template: `
    <app-component-page [sections]="page.sections" [componentId]="page.componentId">
      <app-component-page-header
        [componentId]="page.componentId"
        [title]="i18n.t(page.titleKey)"
        [description]="i18n.t(page.descriptionKey)"
        [registryDeps]="page.registryDeps"
        [ssrSafe]="page.ssrSafe"
        [hasAccessibilityNotes]="true"
        [hasKeyboardSupport]="true"
      />

      <app-component-page-section [section]="section('basic')">
        <app-component-page-code-previewer [code]="examples.basic" language="angular-html">
          <div previewer class="flex w-full flex-wrap items-start justify-center gap-6 px-4">
            <sanring-image-cropper
              #basic="sanringImageCropper"
              class="min-w-0 max-w-md"
              src="/avatars/path.jpg"
              [aspectRatio]="4 / 3"
              [cropAreaLabel]="i18n.t('imageCropper.demo.cropArea')"
              [instructions]="i18n.t('imageCropper.demo.instructions')"
            />
            <div class="grid gap-3">
              <sanring-image-cropper-preview
                [for]="basic"
                [size]="200"
                [ariaLabel]="i18n.t('imageCropper.demo.preview')"
              />
              @if (basic.outputSize(); as size) {
                <span class="font-mono text-xs text-[var(--docs-muted)]">
                  {{ size.width }} × {{ size.height }} px
                </span>
              }
              <sanring-image-cropper-format
                [for]="basic"
                [formatGroupLabel]="i18n.t('imageCropper.demo.format')"
                [qualityLabel]="i18n.t('imageCropper.demo.quality')"
                [backgroundLabel]="i18n.t('imageCropper.demo.background')"
                [unsupportedLabel]="i18n.t('imageCropper.demo.unsupported')"
              />
              <button sanringBtn type="button" (click)="download(basic, 'photo')">
                {{ i18n.t('imageCropper.demo.download') }}
              </button>
            </div>
          </div>
        </app-component-page-code-previewer>
        <app-component-page-code-block class="mt-4 block" [code]="examples.basicTs" language="typescript" />
      </app-component-page-section>

      <app-component-page-section [section]="section('usage')">
        <div class="grid gap-6">
          <app-component-page-usage-imports [code]="examples.usageImport" />
          <app-component-page-code-block [code]="examples.usageMain" language="angular-html" />
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="section('installation')">
        <app-component-page-installation
          componentName="image-cropper"
          manualSnippet="import { SANRING_IMAGE_CROPPER_IMPORTS } from './components/ui/image-cropper';"
        />
      </app-component-page-section>

      <app-component-page-section [section]="section('example')">
        <div class="grid gap-2">
          <app-component-page-section [section]="section('example-aspect')">
            <app-component-page-code-previewer [code]="examples.aspect" language="angular-html">
              <div previewer class="grid w-full justify-items-center gap-4 px-4">
                <div
                  role="group"
                  class="inline-flex gap-0.5 rounded-[var(--sanring-radius-sm)] border border-[var(--docs-border)] p-0.5"
                  [attr.aria-label]="i18n.t('imageCropper.demo.aspect')"
                >
                  @for (item of ratios; track item.label) {
                    <button
                      type="button"
                      class="rounded-[var(--sanring-radius-xs)] px-2.5 py-1 text-xs font-medium"
                      [class]="
                        ratio() === item.value
                          ? 'bg-[var(--sanring-foreground)] text-[var(--sanring-background)]'
                          : 'text-[var(--docs-muted)]'
                      "
                      [attr.aria-pressed]="ratio() === item.value"
                      (click)="ratio.set(item.value)"
                    >
                      {{ item.value === null ? i18n.t('imageCropper.demo.free') : item.label }}
                    </button>
                  }
                </div>
                <div class="flex flex-wrap items-start justify-center gap-6">
                  <sanring-image-cropper
                    #aspect="sanringImageCropper"
                    class="min-w-0 max-w-md"
                    src="/avatars/stairs.jpg"
                    [aspectRatio]="ratio()"
                    [cropAreaLabel]="i18n.t('imageCropper.demo.cropArea')"
                    [instructions]="i18n.t('imageCropper.demo.instructions')"
                  />
                  <sanring-image-cropper-preview
                    [for]="aspect"
                    [ariaLabel]="i18n.t('imageCropper.demo.preview')"
                  />
                </div>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-avatar')">
            <app-component-page-code-previewer [code]="examples.avatar" language="angular-html">
              <div previewer class="flex w-full flex-wrap items-start justify-center gap-6 px-4">
                <sanring-image-cropper
                  #avatar="sanringImageCropper"
                  class="min-w-0 max-w-sm"
                  src="/avatars/lantern.jpg"
                  shape="circle"
                  [aspectRatio]="1"
                  [outputWidth]="256"
                  [formats]="avatarFormats"
                  [cropAreaLabel]="i18n.t('imageCropper.demo.cropArea')"
                  [instructions]="i18n.t('imageCropper.demo.instructions')"
                />
                <div class="grid justify-items-start gap-3">
                  <sanring-image-cropper-preview
                    [for]="avatar"
                    [size]="96"
                    [ariaLabel]="i18n.t('imageCropper.demo.preview')"
                  />
                  <sanring-image-cropper-format
                    [for]="avatar"
                    [formatGroupLabel]="i18n.t('imageCropper.demo.format')"
                    [qualityLabel]="i18n.t('imageCropper.demo.quality')"
                    [backgroundLabel]="i18n.t('imageCropper.demo.background')"
                    [unsupportedLabel]="i18n.t('imageCropper.demo.unsupported')"
                  />
                  <button sanringBtn variant="outline" type="button" (click)="download(avatar, 'avatar')">
                    {{ i18n.t('imageCropper.demo.download') }}
                  </button>
                </div>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-pan-zoom')">
            <app-component-page-code-previewer [code]="examples.panZoom" language="angular-html">
              <div previewer class="flex w-full flex-wrap items-start justify-center gap-6 px-4">
                <sanring-image-cropper
                  #panZoom="sanringImageCropper"
                  class="grid w-full max-w-xs gap-3"
                  mode="pan-zoom"
                  shape="circle"
                  src="/avatars/stairs.jpg"
                  [aspectRatio]="1"
                  [outputWidth]="256"
                  [cropAreaLabel]="i18n.t('imageCropper.demo.cropArea')"
                  [instructions]="i18n.t('imageCropper.demo.panZoomInstructions')"
                >
                  <sanring-image-cropper-zoom
                    [zoomLabel]="i18n.t('imageCropper.demo.zoom')"
                    [zoomInLabel]="i18n.t('imageCropper.demo.zoomIn')"
                    [zoomOutLabel]="i18n.t('imageCropper.demo.zoomOut')"
                  />
                </sanring-image-cropper>
                <div class="grid justify-items-start gap-3">
                  <sanring-image-cropper-preview
                    [for]="panZoom"
                    [size]="96"
                    [ariaLabel]="i18n.t('imageCropper.demo.preview')"
                  />
                  <button sanringBtn variant="outline" type="button" (click)="download(panZoom, 'avatar')">
                    {{ i18n.t('imageCropper.demo.download') }}
                  </button>
                </div>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-upload')">
            <app-component-page-code-previewer [code]="examples.upload" language="angular-html">
              <div previewer class="grid w-full justify-items-center gap-4 px-4">
                <sanring-file-upload accept="image/*" (filesChange)="uploaded.set($event[0] ?? null)">
                  <button sanringBtn variant="outline" sanringFileTrigger type="button">
                    {{ i18n.t('imageCropper.demo.choose') }}
                  </button>
                </sanring-file-upload>
                <div class="flex flex-wrap items-start justify-center gap-6">
                  <sanring-image-cropper
                    #upload="sanringImageCropper"
                    class="min-w-0 max-w-md"
                    [src]="uploaded()"
                    [cropAreaLabel]="i18n.t('imageCropper.demo.cropArea')"
                    [instructions]="i18n.t('imageCropper.demo.instructions')"
                  >
                    <span sanringImageCropperEmpty>{{ i18n.t('imageCropper.demo.empty') }}</span>
                  </sanring-image-cropper>
                  @if (uploaded()) {
                    <div class="grid justify-items-start gap-3">
                      <sanring-image-cropper-preview
                        [for]="upload"
                        [ariaLabel]="i18n.t('imageCropper.demo.preview')"
                      />
                      <sanring-image-cropper-format
                        [for]="upload"
                        [formatGroupLabel]="i18n.t('imageCropper.demo.format')"
                        [qualityLabel]="i18n.t('imageCropper.demo.quality')"
                        [backgroundLabel]="i18n.t('imageCropper.demo.background')"
                        [unsupportedLabel]="i18n.t('imageCropper.demo.unsupported')"
                      />
                      <button sanringBtn type="button" (click)="download(upload)">
                        {{ i18n.t('imageCropper.demo.download') }}
                      </button>
                    </div>
                  }
                </div>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="section('api')">
        <app-component-page-api-table [rows]="page.apiRows!" />
      </app-component-page-section>

      <app-component-page-section [section]="section('accessibility')" />

      <app-component-page-section [section]="section('keyboard')">
        <app-component-page-keyboard-table [rows]="page.keyboardRows!" />
      </app-component-page-section>

      <app-component-page-section [section]="section('stateModel')" />
    </app-component-page>
  `,
})
export class ImageCropperPageComponent {
  protected readonly page = imageCropperPage;
  protected readonly examples = imageCropperPageExamples;
  protected readonly i18n = inject(I18nService);
  protected readonly ratios = RATIOS;
  protected readonly ratio = signal<number | null>(1);
  protected readonly avatarFormats = ['image/png', 'image/webp'] as const;
  protected readonly uploaded = signal<File | null>(null);

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }

  protected async download(cropper: ImageCropperComponent, fileName?: string): Promise<void> {
    const file = await cropper.export(fileName ? { fileName } : {});
    const url = URL.createObjectURL(file);
    const link = Object.assign(document.createElement('a'), { href: url, download: file.name });
    link.click();
    URL.revokeObjectURL(url);
  }
}

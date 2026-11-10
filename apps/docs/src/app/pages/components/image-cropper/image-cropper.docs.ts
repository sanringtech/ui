import {
  ComponentPageApiRow,
  ComponentPageKeyboardRow,
  ComponentPageDefinition,
} from '../../../docs-schema/component-page.types';

export const imageCropperPage = {
  componentId: 'image-cropper',
  titleKey: 'component.imageCropper',
  descriptionKey: 'imageCropper.description',
  registryDeps: ['component-styles', 'utils'],
  ssrSafe: true,
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'imageCropper.examples.basic.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'imageCropper.usage.description',
      level: 2,
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'imageCropper.installation.description',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      level: 2,
      children: [
        {
          id: 'example-aspect',
          titleKey: 'imageCropper.demo.aspect',
          descriptionKey: 'imageCropper.examples.aspect.description',
          level: 3,
        },
        {
          id: 'example-avatar',
          titleKey: 'imageCropper.demo.avatar',
          descriptionKey: 'imageCropper.examples.avatar.description',
          level: 3,
        },
        {
          id: 'example-upload',
          titleKey: 'imageCropper.demo.upload',
          descriptionKey: 'imageCropper.examples.upload.description',
          level: 3,
        },
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'imageCropper.api.description',
      level: 2,
    },
    {
      id: 'accessibility',
      titleKey: 'toc.accessibility',
      descriptionKey: 'imageCropper.accessibility.description',
      level: 2,
    },
    {
      id: 'keyboard',
      titleKey: 'toc.keyboard',
      descriptionKey: 'imageCropper.keyboard.description',
      level: 2,
    },
    {
      id: 'stateModel',
      titleKey: 'toc.stateModel',
      descriptionKey: 'imageCropper.stateModel.description',
      level: 2,
    },
  ],
  apiRows: [
    { property: 'class', type: 'string', defaultValue: "''", descriptionKey: 'imageCropper.api.class.description' },
    { property: 'src', type: 'File | Blob | string | null', defaultValue: 'null', descriptionKey: 'imageCropper.api.src.description' },
    { property: 'crop', type: 'CropRect | null', defaultValue: 'null', descriptionKey: 'imageCropper.api.crop.description' },
    { property: 'aspectRatio', type: "number | 'free' | null", defaultValue: 'null', descriptionKey: 'imageCropper.api.aspectRatio.description' },
    { property: 'minSize', type: 'number', defaultValue: '16', descriptionKey: 'imageCropper.api.minSize.description' },
    { property: 'shape', type: "'rect' | 'circle'", defaultValue: "'rect'", descriptionKey: 'imageCropper.api.shape.description' },
    { property: 'format', type: "'image/png' | 'image/jpeg' | 'image/webp' | null", defaultValue: 'null', descriptionKey: 'imageCropper.api.format.description' },
    { property: 'formats', type: 'ImageCropperFormat[]', defaultValue: 'all three', descriptionKey: 'imageCropper.api.formats.description' },
    { property: 'quality', type: 'number', defaultValue: '0.92', descriptionKey: 'imageCropper.api.quality.description' },
    { property: 'background', type: 'string', defaultValue: "'#ffffff'", descriptionKey: 'imageCropper.api.background.description' },
    { property: 'outputWidth', type: 'number | null', defaultValue: 'null', descriptionKey: 'imageCropper.api.outputWidth.description' },
    { property: 'fileName', type: 'string', defaultValue: '—', descriptionKey: 'imageCropper.api.fileName.description' },
    { property: 'crossOrigin', type: "'anonymous' | 'use-credentials' | null", defaultValue: 'null', descriptionKey: 'imageCropper.api.crossOrigin.description' },
    { property: 'disabled', type: 'boolean', defaultValue: 'false', descriptionKey: 'imageCropper.api.disabled.description' },
    { property: 'guides', type: 'boolean', defaultValue: 'true', descriptionKey: 'imageCropper.api.guides.description' },
    { property: 'loaded', type: 'EventEmitter<{ width; height }>', defaultValue: '—', descriptionKey: 'imageCropper.api.loaded.description' },
    { property: 'loadError', type: 'EventEmitter<void>', defaultValue: '—', descriptionKey: 'imageCropper.api.loadError.description' },
    { property: 'export()', type: '(options?) => Promise<File>', defaultValue: '—', descriptionKey: 'imageCropper.api.export.description' },
    { property: 'reset()', type: '() => void', defaultValue: '—', descriptionKey: 'imageCropper.api.reset.description' },
    { property: 'cropAreaLabel / instructions / emptyLabel', type: 'string', defaultValue: 'English', descriptionKey: 'imageCropper.api.labels.description' },
    { property: 'preview: for / size', type: 'ImageCropperComponent / number', defaultValue: 'parent / 160', descriptionKey: 'imageCropper.api.preview.description' },
    { property: 'format picker: for', type: 'ImageCropperComponent', defaultValue: 'parent', descriptionKey: 'imageCropper.api.formatPicker.description' },
  ] satisfies readonly ComponentPageApiRow[],
  keyboardRows: [
    { keys: 'Arrow keys', descriptionKey: 'imageCropper.keyboard.arrows' },
    { keys: 'Shift + Arrow keys', descriptionKey: 'imageCropper.keyboard.shift' },
    { keys: 'Alt (Option) + Arrow keys', descriptionKey: 'imageCropper.keyboard.alt' },
  ] satisfies readonly ComponentPageKeyboardRow[],
} as const satisfies ComponentPageDefinition;

export const imageCropperPageExamples = {
  basic: `<div class="flex flex-wrap items-start gap-6">
  <sanring-image-cropper #cropper="sanringImageCropper" src="/photos/path.jpg" [aspectRatio]="4 / 3" />

  <div class="grid gap-3">
    <sanring-image-cropper-preview [for]="cropper" [size]="200" />
    <sanring-image-cropper-format [for]="cropper" />
    <button sanringBtn type="button" (click)="download(cropper)">Download</button>
  </div>
</div>`,
  basicTs: `async download(cropper: ImageCropperComponent) {
  const file = await cropper.export({ fileName: 'photo' });
  const url = URL.createObjectURL(file);
  const link = Object.assign(document.createElement('a'), { href: url, download: file.name });
  link.click();
  URL.revokeObjectURL(url);
}`,
  usageImport: `import { SANRING_IMAGE_CROPPER_IMPORTS } from './components/ui/image-cropper';

@Component({
  imports: [SANRING_IMAGE_CROPPER_IMPORTS],
})`,
  usageMain: `<!-- Children find the cropper they are nested in; elsewhere, pass [for]. -->
<sanring-image-cropper [src]="file" [aspectRatio]="1" [(crop)]="crop" [(format)]="format">
  <sanring-image-cropper-preview />
  <sanring-image-cropper-format />
</sanring-image-cropper>`,
  aspect: `<sanring-image-cropper #cropper="sanringImageCropper" src="/photos/stairs.jpg" [aspectRatio]="ratio()" />
<sanring-image-cropper-preview [for]="cropper" />

<!-- ratio: null (free) | 1 | 4 / 3 | 16 / 9 -->`,
  avatar: `<!-- Circle + outputWidth: a 256 px avatar. PNG / WebP keep transparent corners;
     JPEG fills them with [background]. -->
<sanring-image-cropper
  #cropper="sanringImageCropper"
  src="/photos/lantern.jpg"
  shape="circle"
  [aspectRatio]="1"
  [outputWidth]="256"
  [formats]="['image/png', 'image/webp']"
/>
<sanring-image-cropper-preview [for]="cropper" [size]="96" />
<sanring-image-cropper-format [for]="cropper" />`,
  upload: `<sanring-file-upload accept="image/*" (filesChange)="file.set($event[0] ?? null)">
  <button sanringBtn variant="outline" sanringFileTrigger type="button">Choose image</button>
</sanring-file-upload>

<!-- The export keeps the uploaded file's name and swaps the extension. -->
<sanring-image-cropper #cropper="sanringImageCropper" [src]="file()">
  <span sanringImageCropperEmpty>Choose an image to start</span>
</sanring-image-cropper>
<sanring-image-cropper-preview [for]="cropper" />
<sanring-image-cropper-format [for]="cropper" />`,
} as const;

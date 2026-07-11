import {
  ComponentPageApiRow,
  ComponentPageDefinition,
} from '../../../docs-schema/component-page.types';

export const fileUploadPage = {
  componentId: 'file-upload',
  titleKey: 'component.fileUpload',
  descriptionKey: 'fileUpload.description',
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'fileUpload.examples.basic.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'fileUpload.usage.description',
      level: 2,
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      level: 2,
      children: [
        {
          id: 'example-trigger',
          titleKey: 'fileUpload.demo.trigger',
          level: 3,
        },
        {
          id: 'example-multiple',
          titleKey: 'fileUpload.demo.multiple',
          level: 3,
        },
        {
          id: 'example-validation',
          titleKey: 'fileUpload.demo.validation',
          level: 3,
        },
        {
          id: 'example-disabled',
          titleKey: 'fileUpload.demo.disabled',
          level: 3,
        },
        {
          id: 'example-field',
          titleKey: 'fileUpload.demo.field',
          level: 3,
        },
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'fileUpload.api.description',
      level: 2,
    },
  ],
  apiRows: [
    {
      property: 'accept',
      type: 'string',
      defaultValue: "'*'",
      descriptionKey: 'fileUpload.api.accept.description',
    },
    {
      property: 'multiple',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'fileUpload.api.multiple.description',
    },
    {
      property: 'disabled',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'fileUpload.api.disabled.description',
    },
    {
      property: 'required',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'fileUpload.api.required.description',
    },
    {
      property: 'maxSize',
      type: 'number | null',
      defaultValue: 'null',
      descriptionKey: 'fileUpload.api.maxSize.description',
    },
    {
      property: 'maxFiles',
      type: 'number | null',
      defaultValue: 'null',
      descriptionKey: 'fileUpload.api.maxFiles.description',
    },
    {
      property: 'files',
      type: 'File[]',
      defaultValue: '[]',
      descriptionKey: 'fileUpload.api.files.description',
    },
  ] satisfies readonly ComponentPageApiRow[],
} as const satisfies ComponentPageDefinition;

export const fileUploadPageExamples = {
  usageImport: `import { FileDropzoneComponent, FileTriggerDirective, FileUploadComponent } from '@sanring/ui';`,
  usageMain: `<sanring-file-upload [(ngModel)]="files">
  <sanring-file-dropzone>
    <button sanringFileTrigger type="button">Browse files</button>
    <p>or drag and drop here</p>
  </sanring-file-dropzone>
</sanring-file-upload>`,
  basic: `<sanring-file-upload [(ngModel)]="files">
  <sanring-file-dropzone class="cursor-pointer text-center">
    <button sanringFileTrigger type="button" class="font-medium underline underline-offset-2">
      Browse files
    </button>
    <p class="text-sm text-muted-foreground">or drag and drop here</p>
  </sanring-file-dropzone>

  @for (file of files; track file) {
    <div class="flex items-center justify-between gap-2 text-sm">
      <span class="truncate">{{ file.name }}</span>
      <button type="button" (click)="removeFile(file)">Remove</button>
    </div>
  }
</sanring-file-upload>`,
  trigger: `<sanring-file-upload [(ngModel)]="files">
  <button sanringFileTrigger type="button">Choose file</button>
  @if (files.length) {
    <p>{{ files[0].name }}</p>
  }
</sanring-file-upload>`,
  multiple: `<sanring-file-upload multiple [(ngModel)]="files">
  <sanring-file-dropzone>
    <button sanringFileTrigger type="button">Browse files</button>
  </sanring-file-dropzone>

  @for (file of files; track file) {
    <div class="flex items-center justify-between gap-2 text-sm">
      <span class="truncate">{{ file.name }}</span>
      <button type="button" (click)="removeFile(file)">Remove</button>
    </div>
  }
</sanring-file-upload>`,
  validation: `<sanring-file-upload
  #upload="sanringFileUpload"
  multiple
  accept="image/*"
  [maxSize]="1024 * 1024"
  [(ngModel)]="files"
>
  <sanring-file-dropzone>
    <button sanringFileTrigger type="button">Browse images (max 1MB)</button>
  </sanring-file-dropzone>

  @for (rejection of upload.rejectedFiles(); track rejection.file) {
    <p class="text-sm text-red-500">{{ rejection.file.name }}: {{ rejection.errors.join(', ') }}</p>
  }
</sanring-file-upload>`,
  disabled: `<sanring-file-upload disabled>
  <sanring-file-dropzone>
    <button sanringFileTrigger type="button">Browse files</button>
  </sanring-file-dropzone>
</sanring-file-upload>`,
  field: `<sanring-field>
  <label sanringLabel>Resume</label>
  <sanring-file-upload accept=".pdf" [maxSize]="2 * 1024 * 1024" [formControl]="resumeControl">
    <sanring-file-dropzone>
      <button sanringFileTrigger type="button">Browse files</button>
    </sanring-file-dropzone>
  </sanring-file-upload>
  <p sanringDescription>PDF only, up to 2MB.</p>
  <sanring-error-message>A file is required.</sanring-error-message>
</sanring-field>`,
} as const;

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
          id: 'example-progress',
          titleKey: 'fileUpload.demo.progress',
          descriptionKey: 'fileUpload.examples.progress.description',
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
    {
      property: 'sanring-file-item [progress]',
      type: 'number | null',
      defaultValue: 'null',
      descriptionKey: 'fileUpload.api.progress.description',
    },
  ] satisfies readonly ComponentPageApiRow[],
} as const satisfies ComponentPageDefinition;

export const fileUploadPageExamples = {
  usageImport: `import { FileDropzoneComponent, FileTriggerDirective, FileUploadComponent } from './components/ui/file-upload';`,
  usageMain: `<sanring-file-upload [(ngModel)]="files">
  <sanring-file-dropzone>
    <button sanringFileTrigger type="button">
      <svg lucideUpload></svg>
      Browse files
    </button>
    <p>or drag and drop here</p>
  </sanring-file-dropzone>
</sanring-file-upload>`,
  basic: `<!-- The dropzone has no built-in icon or copy — precise layout (like an icon
     sitting right next to "Browse files") only works if you compose it yourself.
     Once a file is accepted, the prompt automatically swaps for a sanring-file-item
     box (name, size, and a remove button). -->
<sanring-file-upload [(ngModel)]="files">
  <sanring-file-dropzone class="cursor-pointer text-center">
    <button
      sanringFileTrigger
      type="button"
      class="inline-flex items-center gap-1.5 font-medium underline underline-offset-2"
    >
      <svg lucideUpload class="size-4"></svg>
      Browse files
    </button>
    <p class="text-sm text-muted-foreground">or drag and drop here</p>
  </sanring-file-dropzone>
</sanring-file-upload>`,
  trigger: `<!-- sanring-file-item also works standalone, outside of a dropzone -->
<sanring-file-upload [(ngModel)]="files">
  <button sanringFileTrigger type="button">Choose file</button>
  @if (files.length) {
    <sanring-file-item [file]="files[0]" />
  }
</sanring-file-upload>`,
  progress: `<!-- sanring-file-item injects FileUploadComponent, so it must stay nested
     inside <sanring-file-upload> — as a sibling it can't find a provider (NG0201).
     FileUploadComponent never performs the upload itself, so the progress number
     always comes from your own upload call (HttpClient reportProgress,
     XMLHttpRequest.upload.onprogress, etc). Pass it straight into [progress]. -->
<sanring-file-upload [(ngModel)]="files">
  <button sanringFileTrigger type="button">Choose file</button>
  @if (files[0]; as file) {
    <sanring-file-item [file]="file" [progress]="uploadProgress()" />
  }
</sanring-file-upload>`,
  multiple: `<sanring-file-upload multiple [(ngModel)]="files">
  <sanring-file-dropzone>
    <button sanringFileTrigger type="button">Browse files</button>
  </sanring-file-dropzone>
</sanring-file-upload>`,
  validation: `<!-- Rejected files render as red sanring-file-item boxes with the rejection
     reason shown in place of the file size -->
<sanring-file-upload multiple accept="image/*" [maxSize]="1024 * 1024" [(ngModel)]="files">
  <sanring-file-dropzone>
    <button sanringFileTrigger type="button">Browse images (max 1MB)</button>
  </sanring-file-dropzone>
</sanring-file-upload>`,
  disabled: `<sanring-file-upload disabled>
  <sanring-file-dropzone>
    <button sanringFileTrigger type="button">Browse files</button>
  </sanring-file-dropzone>
</sanring-file-upload>`,
  field: `<sanring-field>
  <label sanringLabel for="resume-upload">Resume</label>
  <sanring-file-upload accept=".pdf" [maxSize]="2 * 1024 * 1024" [formControl]="resumeControl">
    <sanring-file-dropzone>
      <button sanringFileTrigger type="button">Browse files</button>
    </sanring-file-dropzone>
  </sanring-file-upload>
  <p sanringDescription>PDF only, up to 2MB.</p>
  <sanring-error-message>A file is required.</sanring-error-message>
</sanring-field>`,
} as const;

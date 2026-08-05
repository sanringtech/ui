export const fileUploadTranslations = {
  'fileUpload.description':
    'A headless file selection control with drag-and-drop, validation, and ControlValueAccessor support.',
  'fileUpload.examples.basic.description':
    'Combine a dropzone and a trigger button inside sanring-file-upload — bind the selected files with ngModel or a reactive form control.',
  'fileUpload.usage.description':
    'Import FileUploadComponent, FileDropzoneComponent, and FileTriggerDirective, then compose them inside a single sanring-file-upload container.',
  'fileUpload.api.description': 'Inputs and models supported by the sanring-file-upload component.',
  'fileUpload.api.accept.description':
    'Comma-separated list of accepted file types or extensions (e.g. "image/*,.pdf"). Defaults to accepting any file.',
  'fileUpload.api.multiple.description':
    'Allows selecting or dropping more than one file at a time.',
  'fileUpload.api.disabled.description':
    'Disables the dropzone and trigger, and reflects setDisabledState() from reactive forms.',
  'fileUpload.api.required.description':
    'Marks the control as required for aria-required and Field error state.',
  'fileUpload.api.maxSize.description':
    'Maximum file size in bytes. Files exceeding this are rejected and reported via rejectedFiles.',
  'fileUpload.api.maxFiles.description':
    'Maximum number of files allowed when multiple is enabled. Extra files are rejected.',
  'fileUpload.api.files.description':
    'Selected files. Two-way bindable with [(files)], or via ngModel/formControl.',
  'fileUpload.api.progress.description':
    'sanring-file-item accepts a standalone [progress] input (0-100). FileUploadComponent never performs the actual upload, so this value always comes from your own upload call — pass null to fall back to showing the file size.',
  'fileUpload.demo.dropzone': 'Dropzone',
  'fileUpload.demo.trigger': 'Trigger only',
  'fileUpload.demo.progress': 'Upload progress',
  'fileUpload.demo.multiple': 'Multiple files',
  'fileUpload.demo.validation': 'Validation',
  'fileUpload.demo.disabled': 'Disabled',
  'fileUpload.demo.field': 'With Field',
  'fileUpload.demo.browse': 'Browse files',
  'fileUpload.demo.dropHint': 'or drag and drop here',
  'fileUpload.demo.chooseFile': 'Choose file',
  'fileUpload.demo.startUpload': 'Simulate upload',
  'fileUpload.demo.fieldLabel': 'Resume',
  'fileUpload.demo.fieldHint': 'PDF only, up to 2MB.',
  'fileUpload.demo.fieldError': 'A file is required.',
  'fileUpload.examples.progress.description':
    'sanring-file-item takes an optional [progress] input — pass it a 0-100 number from your own upload logic and it replaces the file size with a progress bar. Set it back to null when the upload finishes.',
  'fileUpload.accessibility.description': 'aria-invalid, aria-required, and aria-describedby are wired to the surrounding sanring-field. The native <input type="file"> inside the dropzone handles its own accessible label via the visible button text or a linked <label>.',
  'fileUpload.keyboard.description': 'Focus and trigger follow native file-input behavior.',
  'fileUpload.keyboard.tab': 'Focus the upload trigger or dropzone.',
  'fileUpload.keyboard.enterOrSpace': 'Open the OS file picker.',
  'fileUpload.stateModel.description': 'Implements ControlValueAccessor. Use [(ngModel)] or formControl, or use the two-way-bindable [(files)] model input directly. Value type: File[] | null. File validation (size, count, type) runs client-side; rejected files are emitted via the rejectedFiles output.',
} as const;

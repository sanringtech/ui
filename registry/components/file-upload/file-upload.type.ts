export const FileUploadErrorCode = {
  Accept: 'accept',
  MaxFiles: 'max-files',
  MaxSize: 'max-size',
} as const;

export type FileUploadErrorCode = (typeof FileUploadErrorCode)[keyof typeof FileUploadErrorCode];

export interface FileRejection {
  file: File;
  errors: FileUploadErrorCode[];
}

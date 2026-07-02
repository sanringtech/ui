import { ComponentPageApiRow, ComponentPageDefinition } from '../../../docs-schema/component-page.types';

export const toastPage = {
  componentId: 'toast',
  titleKey: 'component.toast',
  descriptionKey: 'toast.description',
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'toast.examples.basic.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'toast.usage.description',
      level: 2,
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'toast.installation.description',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      descriptionKey: 'toast.examples.description',
      level: 2,
      children: [
        { id: 'example-variant', titleKey: 'toast.demo.variant', level: 3 },
        { id: 'example-action', titleKey: 'toast.demo.action', level: 3 },
        { id: 'example-position', titleKey: 'toast.demo.position', level: 3 },
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'toast.api.description',
      level: 2,
    },
  ],
  apiRows: [
    { property: 'ToastService.show(options)', type: 'method', defaultValue: '-', descriptionKey: 'toast.api.show.description' },
    { property: 'success(title, options)', type: 'method', defaultValue: '-', descriptionKey: 'toast.api.success.description' },
    { property: 'error(title, options)', type: 'method', defaultValue: '-', descriptionKey: 'toast.api.error.description' },
    { property: 'warning(title, options)', type: 'method', defaultValue: '-', descriptionKey: 'toast.api.warning.description' },
    { property: 'info(title, options)', type: 'method', defaultValue: '-', descriptionKey: 'toast.api.info.description' },
    { property: 'dismiss(id)', type: 'method', defaultValue: '-', descriptionKey: 'toast.api.dismiss.description' },
    { property: 'dismissAll()', type: 'method', defaultValue: '-', descriptionKey: 'toast.api.dismissAll.description' },
    { property: 'position', type: 'ToastPosition', defaultValue: "'bottom-right'", descriptionKey: 'toast.api.position.description' },
    { property: 'maxToasts', type: 'number', defaultValue: '3', descriptionKey: 'toast.api.maxToasts.description' },
    { property: 'stacked', type: 'boolean', defaultValue: 'true', descriptionKey: 'toast.api.stacked.description' },
    { property: 'toastHeight', type: 'number', defaultValue: '72', descriptionKey: 'toast.api.toastHeight.description' },
    { property: 'duration', type: 'number', defaultValue: '5000', descriptionKey: 'toast.api.duration.description' },
    { property: 'closable', type: 'boolean', defaultValue: 'true', descriptionKey: 'toast.api.closable.description' },
    { property: 'action', type: 'ToastAction', defaultValue: '-', descriptionKey: 'toast.api.action.description' },
  ] satisfies readonly ComponentPageApiRow[],
} as const satisfies ComponentPageDefinition;

export const toastPageExamples = {
  basic: `<sanring-toaster />

<button sanringBtn type="button" (click)="toast.success('Saved')">
  Show toast
</button>`,
  usageImport: `import { SANRING_TOAST_IMPORTS, ToastService } from '@sanring/ui';`,
  usageMain: `private readonly toast = inject(ToastService);

save() {
  this.toast.success('Project saved', {
    description: 'Your changes are now available to the team.',
  });
}`,
  variant: `<button type="button" (click)="toast.success('Saved')">Success</button>
<button type="button" (click)="toast.error('Upload failed')">Error</button>
<button type="button" (click)="toast.warning('Storage almost full')">Warning</button>
<button type="button" (click)="toast.info('Sync complete')">Info</button>`,
  action: `this.toast.info('Draft ready', {
  description: 'Review the generated changes before publishing.',
  duration: 0,
  action: {
    label: 'Review',
    onClick: () => this.openReview(),
  },
});`,
  position: `<!-- Each position gets its own toaster with an isolated ToastService -->
@Component({
  providers: [ToastService],
  template: \`
    <sanring-toaster [position]="position" />
    <button (click)="toast.info('Hello from ' + position)">Show</button>
  \`,
})
class PositionDemo {
  position = input.required<ToastPosition>();
  toast    = inject(ToastService);
}`,
} as const;

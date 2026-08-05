export const toastTranslations = {
  'toast.description':
    'A transient notification system for status updates, errors, and lightweight actions.',
  'toast.examples.basic.description':
    'Trigger a toast through ToastService and render it with a single sanring-toaster viewport.',
  'toast.usage.description':
    'Place sanring-toaster once in your app shell, then inject ToastService wherever notifications are created.',
  'toast.installation.description':
    'Import ToasterComponent for rendering and ToastService for imperative notifications.',
  'toast.examples.description':
    'Common toast patterns for semantic variants, persistent actions, and viewport positions.',
  'toast.demo.variant': 'Variants',
  'toast.demo.action': 'Action',
  'toast.demo.position': 'Position',
  'toast.demo.showToast': 'Show toast',
  'toast.demo.showAction': 'Show action toast',
  'toast.demo.success': 'Success',
  'toast.demo.error': 'Error',
  'toast.demo.warning': 'Warning',
  'toast.demo.info': 'Info',
  'toast.demo.basicTitle': 'Project saved',
  'toast.demo.basicDescription': 'Your changes are now available to the team.',
  'toast.demo.successTitle': 'Saved successfully',
  'toast.demo.successDescription': 'The workspace snapshot has been updated.',
  'toast.demo.errorTitle': 'Upload failed',
  'toast.demo.errorDescription': 'Check the file size and try again.',
  'toast.demo.warningTitle': 'Storage almost full',
  'toast.demo.warningDescription': 'Archive older exports before creating more snapshots.',
  'toast.demo.infoTitle': 'Sync complete',
  'toast.demo.infoDescription': 'All records are up to date.',
  'toast.demo.actionTitle': 'Draft ready',
  'toast.demo.actionDescription': 'Review the generated changes before publishing.',
  'toast.demo.review': 'Review',
  'toast.demo.reviewedTitle': 'Review opened',
  'toast.demo.positionTitle': 'Toast position updated',
  'toast.demo.positionDescription': 'Choose a viewport position, then a toast will appear there.',
  'toast.api.description': 'ToastService methods, toaster inputs, and toast option fields.',
  'toast.api.show.description': 'Creates a toast from ToastOptions and returns its generated id.',
  'toast.api.success.description': 'Creates a success toast with a title and optional options.',
  'toast.api.error.description':
    'Creates an error toast and announces it assertively through LiveAnnouncer.',
  'toast.api.warning.description': 'Creates a warning toast with the warning visual treatment.',
  'toast.api.info.description': 'Creates an informational toast.',
  'toast.api.dismiss.description': 'Dismisses a toast by id and clears its timer.',
  'toast.api.dismissAll.description': 'Dismisses all visible toasts and clears every active timer.',
  'toast.api.position.description': 'Viewport position used by sanring-toaster.',
  'toast.api.maxToasts.description': 'Maximum number of toasts rendered by this toaster viewport.',
  'toast.api.stacked.description':
    'Uses overlapping stacked presentation instead of a normal list.',
  'toast.api.toastHeight.description':
    'Estimated toast height used to calculate stacked viewport height.',
  'toast.api.duration.description':
    'Auto-dismiss duration in milliseconds. Use 0 for persistent toasts.',
  'toast.api.closable.description': 'Controls whether the dismiss button is rendered.',
  'toast.api.action.description': 'Optional action button rendered inside the toast.',
  'toast.accessibility.description':
    'ToastService announces notifications through LiveAnnouncer; errors use assertive announcements while other variants are more polite. Closable toasts render a focusable dismiss button.',
  'toast.stateModel.description':
    'Toast state is owned by ToastService, including id, variant, duration, leaving, paused, and action. sanring-toaster renders the currently visible notifications for its position and stacking settings.',

} as const;

export const alertDialogTranslations = {
  'alertDialog.description':
    'A modal confirmation dialog for destructive or important actions. Unlike Dialog, it cannot be dismissed by clicking the backdrop or pressing Escape.',
  'alertDialog.demo.open': 'Delete account',
  'alertDialog.demo.cancel': 'Cancel',
  'alertDialog.demo.action': 'Delete',
  'alertDialog.demo.customResultTitle': 'Remove item',
  'alertDialog.demo.customResult': 'Custom result value',
  'alertDialog.demo.mediaTitle': 'Share project',
  'alertDialog.demo.mediaDescription':
    'Anyone with the link will be able to view and edit this project.',
  'alertDialog.demo.share': 'Share',
  'alertDialog.examples.description':
    'Confirmation flows that require an explicit choice before the dialog closes.',
  'alertDialog.examples.basic.description':
    'Use `sanringAlertDialogTrigger` and compose the body from `AlertDialogContent`, `DialogHeader`/`DialogFooter`, title, description, and the action/cancel directives.',
  'alertDialog.usage.description':
    'Import the alert dialog primitives and bind `sanringAlertDialogTrigger` to an `ng-template`, pairing `sanringAlertDialogCancel` with `sanringAlertDialogAction` inside it.',
  'alertDialog.installation.description':
    'Alert Dialog builds on Dialog — installing it also installs the Dialog primitives it depends on.',
  'alertDialog.composition.description':
    '`AlertDialogContent` extends `DialogContent` with the close button hidden by default. Pair it with `DialogHeader`, an optional `DialogMedia` icon, `sanringDialogTitle`, `sanringDialogDescription`, `DialogFooter`, `sanringAlertDialogCancel`, and `sanringAlertDialogAction`.',
  'alertDialog.api.description': 'Inputs supported by the alert dialog primitives.',
  'alertDialog.api.trigger.description':
    'Template rendered inside the alert dialog when the trigger is activated.',
  'alertDialog.api.triggerConfig.description':
    'Optional CDK `DialogConfig` merged into the opened dialog. `role` and `disableClose` are always locked regardless of what is passed here.',
  'alertDialog.api.class.description':
    'Additional classes merged with `AlertDialogContent` layout styles.',
  'alertDialog.api.showClose.description':
    'Controls whether the built-in close button is rendered. Defaults to `false`, unlike Dialog.',
  'alertDialog.api.action.description':
    'Optional result value passed to `DialogRef.close()` when clicked. Defaults to `true`.',
  'alertDialog.api.cancel.description':
    'Optional result value passed to `DialogRef.close()` when clicked. Defaults to `false`.',
  'alertDialog.accessibility.description':
    "The dialog container receives role='alertdialog' and aria-modal='true' (enforced by AlertDialogService — callers cannot override these). Backdrop click and Escape are both disabled, requiring users to explicitly choose a confirm or cancel button.",
  'alertDialog.keyboard.description': 'Focus is trapped inside the alert dialog while it is open.',
  'alertDialog.keyboard.tab': 'Move focus to the next focusable element within the dialog.',
  'alertDialog.keyboard.shiftTab': 'Move focus to the previous focusable element within the dialog.',
  'alertDialog.keyboard.escape': 'Has no effect — backdrop dismiss and Escape are disabled by default to prevent accidental dismissal.',
  'alertDialog.stateModel.description':
    "Service-based. Call AlertDialogService.open(template, config) to open an alert dialog programmatically, or use [sanringAlertDialogTrigger] for template-driven use. The service always forces role='alertdialog' and disableClose:true — callers cannot opt out. Not a form control.",
} as const;

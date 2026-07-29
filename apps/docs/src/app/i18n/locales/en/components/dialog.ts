export const dialogTranslations = {
  'dialog.description':
    'An overlay primitive built on Angular CDK Dialog for modal tasks and focused decisions.',
  'dialog.demo.open': 'Open dialog',
  'dialog.demo.customClose': 'Custom Close Button',
  'dialog.demo.media': 'With Media',
  'dialog.demo.configResult': 'Config and Result',
  'dialog.demo.noClose': 'No Close Button',
  'dialog.demo.stickyFooter': 'Sticky Footer',
  'dialog.demo.scrollable': 'Scrollable Content',
  'dialog.examples.description':
    'Common dialog patterns for custom actions, hidden close controls, sticky actions, and dense scrollable content.',
  'dialog.examples.basic.description':
    'Use a trigger with an ng-template and compose the dialog body from content, header, title, description, and footer primitives.',
  'dialog.usage.description':
    'Import the dialog primitives and bind sanringDialogTrigger to an ng-template.',
  'dialog.installation.description':
    'Dialog is powered by Angular CDK Dialog. Add the component with the CLI, then compose the exported primitives.',
  'dialog.composition.description':
    'Use DialogContent for the panel, DialogHeader/DialogFooter for layout, optional DialogMedia for emphasis, and sanringDialogTrigger/sanringDialogClose for config and close results.',
  'dialog.api.description': 'Inputs supported by the dialog primitives.',
  'dialog.api.class.description': 'Additional classes merged with DialogContent layout styles.',
  'dialog.api.showClose.description': 'Controls whether the built-in close button is rendered.',
  'dialog.api.triggerConfig.description':
    'CDK DialogConfig passed when sanringDialogTrigger opens the template.',
  'dialog.api.closeResult.description':
    'Optional result value emitted when sanringDialogClose closes the dialog.',
  'dialog.api.mediaClass.description': 'Additional classes merged with the dialog media container.',
} as const;

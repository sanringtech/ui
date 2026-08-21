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
  'dialog.api.ariaLabel.description':
    'Accessible-name fallback used when no sanringDialogTitle is projected. DialogConfig ariaLabel remains supported.',
  'dialog.api.ariaLabelledBy.description':
    'Ids of external elements that label the dialog. Takes precedence over the projected title and ariaLabel.',
  'dialog.api.ariaDescribedBy.description':
    'Ids of external elements that describe the dialog. Takes precedence over sanringDialogDescription.',
  'dialog.api.triggerConfig.description':
    'CDK DialogConfig passed when sanringDialogTrigger opens the template.',
  'dialog.api.closeResult.description':
    'Optional result value emitted when sanringDialogClose closes the dialog.',
  'dialog.api.mediaClass.description': 'Additional classes merged with the dialog media container.',
  'dialog.accessibility.description':
    "The CDK Dialog container receives role='dialog' and aria-modal='true'. Projected titles and descriptions are wired automatically; ariaLabel provides a fallback name for untitled content. Angular CDK's FocusTrap keeps Tab and Shift+Tab cycling within the open dialog.",
  'dialog.keyboard.description': 'Focus is trapped inside the dialog while it is open.',
  'dialog.keyboard.tab': 'Move focus to the next focusable element within the dialog.',
  'dialog.keyboard.shiftTab': 'Move focus to the previous focusable element within the dialog.',
  'dialog.keyboard.escape':
    'Close the dialog. Blocked when disableClose is set in the trigger config.',
  'dialog.stateModel.description':
    "Trigger-based. Bind [sanringDialogTrigger] to an ng-template reference to open the dialog. Pass [sanringDialogConfig] to configure CDK options (e.g. { disableClose: true }). Inside the template, bind [sanringDialogClose]='result' to close with an optional typed result. Dialog is not a form control — there is no CVA integration.",
} as const;

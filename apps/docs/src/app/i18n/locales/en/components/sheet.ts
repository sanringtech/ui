export const sheetTranslations = {
  'sheet.description':
    'A slide-over panel anchored to any edge of the viewport — a focused alternative to a full dialog for contextual tasks and settings.',
  'sheet.examples.basic.description': 'A sheet that slides in from the right edge.',
  'sheet.usage.description':
    'Wrap content in sanring-sheet, add a sanringSheetTrigger button, then place sanring-sheet-content inside with the desired side.',
  'sheet.installation.description':
    'Add the component with the CLI, then import the sheet primitives.',
  'sheet.composition.description':
    'Sheet is composed from a state root, trigger, content panel, and optional header/footer primitives.',
  'sheet.examples.description':
    'Common sheet patterns: different edge positions and a form layout with header and footer.',
  'sheet.demo.side': 'Side',
  'sheet.demo.open': 'Open Sheet',
  'sheet.demo.openTop': 'Top',
  'sheet.demo.openRight': 'Right',
  'sheet.demo.openBottom': 'Bottom',
  'sheet.demo.openLeft': 'Left',
  'sheet.demo.close': 'Close',
  'sheet.demo.withForm': 'With Form',
  'sheet.demo.editProfile': 'Edit profile',
  'sheet.demo.editProfileDescription': 'Make changes to your profile here. Click save when done.',
  'sheet.demo.name': 'Name',
  'sheet.demo.username': 'Username',
  'sheet.demo.cancel': 'Cancel',
  'sheet.demo.saveChanges': 'Save changes',
  'sheet.api.description': 'Inputs and outputs supported by the sheet primitives.',
  'sheet.api.isOpen.description': 'Controls the open state. Supports [(isOpen)] two-way binding.',
  'sheet.api.side.description':
    "Edge from which the panel slides in: 'top', 'right' (default), 'bottom', or 'left'.",
  'sheet.demo.customClose': 'Custom Close Button',
  'sheet.demo.confirmDelete': 'Confirm deletion',
  'sheet.demo.confirmDeleteDescription': 'This action cannot be undone.',
  'sheet.demo.delete': 'Delete',
  'sheet.api.class.description': 'Additional classes merged onto the panel or host element.',
  'sheet.accessibility.description':
    "The panel has role='dialog' and aria-modal='true'. sanringSheetTitle and sanringSheetDescription provide aria-labelledby and aria-describedby on the panel automatically. Background sibling elements get aria-hidden='true' while the sheet is open, preventing screen reader navigation outside the panel.",
  'sheet.keyboard.description': 'Focus is trapped inside the sheet panel while it is open.',
  'sheet.keyboard.tabShiftTab': 'Move focus within the sheet panel (focus is trapped inside).',
  'sheet.keyboard.escape': 'Close the sheet.',
  'sheet.stateModel.description':
    "Trigger-based, same pattern as Dialog. Bind [sanringSheetTrigger] to an ng-template. Use [sanringSheetClose]='result' inside the template to close with an optional typed result. The side input ('left', 'right', 'top', 'bottom') controls which edge the sheet slides in from. Not a CVA form control.",
} as const;

export const stepperTranslations = {
  'stepper.description': 'A CDK-backed workflow primitive for guiding users through ordered steps.',
  'stepper.examples.basic.description':
    'Compose sanring-stepper with sanring-step panels and next/previous buttons for multi-step flows.',
  'stepper.usage.description':
    'Import the stepper primitives and place sanring-step children inside sanring-stepper.',
  'stepper.installation.description':
    'Stepper is built on Angular CDK Stepper. Import the primitives you need for steps, labels, icons, and navigation buttons.',
  'stepper.demo.dashed': 'Dashed connector',
  'stepper.demo.customLabel': 'Custom label and icon',
  'stepper.demo.vertical': 'Vertical',
  'stepper.demo.account': 'Account',
  'stepper.demo.profile': 'Profile',
  'stepper.demo.review': 'Review',
  'stepper.demo.accountTitle': 'Create the account',
  'stepper.demo.accountDescription': 'Collect the required account details before profile setup.',
  'stepper.demo.profileTitle': 'Add profile details',
  'stepper.demo.profileDescription':
    'Optional information can be skipped without blocking the flow.',
  'stepper.demo.reviewTitle': 'Review and confirm',
  'stepper.demo.reviewDescription': 'Check the collected information before continuing.',
  'stepper.demo.next': 'Next',
  'stepper.demo.back': 'Back',
  'stepper.demo.cart': 'Cart',
  'stepper.demo.shipping': 'Shipping',
  'stepper.demo.payment': 'Payment',
  'stepper.demo.cartContent': 'Cart has been reviewed.',
  'stepper.demo.shippingContent': 'Shipping details are active.',
  'stepper.demo.paymentContent': 'Payment is next.',
  'stepper.demo.plan': 'Plan',
  'stepper.demo.build': 'Build',
  'stepper.demo.deploy': 'Deploy',
  'stepper.demo.planContent': 'Define the release scope.',
  'stepper.demo.buildContent': 'Run the build and checks.',
  'stepper.demo.deployContent': 'Deployment needs attention.',
  'stepper.api.description': 'Inputs and helper directives supported by the Stepper primitives.',
  'stepper.api.class.description': 'Additional classes merged with the stepper root.',
  'stepper.api.lineStyle.description': 'Connector style rendered between step headers.',
  'stepper.api.optionalLabel.description': 'Text shown below optional step labels.',
  'stepper.api.linear.description':
    'Uses CDK Stepper linear mode to block navigation until previous steps are complete.',
  'stepper.api.orientation.description':
    'CDK Stepper orientation used for header layout and keyboard behavior.',
  'stepper.api.selectedIndex.description':
    'Currently selected step index. Supports two-way binding through selectedIndexChange.',
  'stepper.api.stepLabel.description':
    'Plain text label for a step. Use sanringStepLabel for a template label.',
  'stepper.api.stepOptional.description':
    'Marks a step as optional and renders the optional helper label.',
  'stepper.api.stepCompleted.description':
    'Marks a step as completed and uses the completed indicator.',
  'stepper.api.stepCustomState.description':
    'Overrides the visual state rendered by the Sanring step header.',
  'stepper.accessibility.description':
    'Built on Angular CDK Stepper. Step headers are focusable step navigation controls, and selected, completed, optional, and disabled states are reflected on the header.',
  'stepper.keyboard.description':
    'Stepper header navigation follows Angular CDK stepper keyboard behavior.',
  'stepper.keyboard.arrowLeftRight':
    'Moves focus between horizontal step headers.',
  'stepper.keyboard.arrowUpDown':
    'Moves focus between vertical step headers.',
  'stepper.keyboard.homeEnd': 'Moves focus to the first or last step header.',
  'stepper.keyboard.enterSpace': 'Selects the focused step when navigation is allowed.',
  'stepper.stateModel.description':
    'selectedIndex is the primary state and emits selectedIndexChange. linear, completed, optional, and customState influence navigation and header presentation; form data belongs to each step content area.',
} as const;

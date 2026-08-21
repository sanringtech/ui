export const datePickerTranslations = {
  'datePicker.description':
    'A calendar-driven input for picking a single date, a range, or multiple dates.',
  'datePicker.examples.description':
    'Practical date-picker patterns for billing periods, fiscal planning, ranges, and form fields.',
  'datePicker.usage.description':
    'Import the component and provide CALENDAR_LOCALE at the app or component level.',
  'datePicker.installation.description':
    'Add the DatePickerComponent from @sanring/ui, and additionally install QuarterStartMonth-related provider setup for quarter granularity.',
  'datePicker.api.description':
    'Inputs, outputs, and public methods supported by DatePickerComponent.',
  'datePicker.examples.basic.description': 'Default setup: month granularity, single selection.',
  'datePicker.demo.matrix': 'Pick by use case',
  'datePicker.demo.matrix.description':
    'Choose a scenario first; the demo maps it to the matching granularity and selection mode.',
  'datePicker.demo.preset.billingMonth': 'Billing month',
  'datePicker.demo.preset.billingMonth.description':
    'Pick one month for invoices, statements, or monthly reports.',
  'datePicker.demo.preset.fiscalQuarter': 'Fiscal quarter',
  'datePicker.demo.preset.fiscalQuarter.description':
    'Pick one quarter for finance, revenue, or planning workflows.',
  'datePicker.demo.preset.planningYear': 'Planning year',
  'datePicker.demo.preset.planningYear.description':
    'Pick a whole year without showing month-level detail.',
  'datePicker.demo.preset.monthRange': 'Month range',
  'datePicker.demo.preset.monthRange.description':
    'Pick a start and end month for coverage windows or subscriptions.',
  'datePicker.demo.preset.reportingMonths': 'Reporting months',
  'datePicker.demo.preset.reportingMonths.description':
    'Pick several non-contiguous months for comparison reports.',
  'datePicker.demo.disabled': 'With disabled rule',
  'datePicker.demo.disabled.description': 'Years before 2026 are disabled.',
  'datePicker.demo.selectTrigger': 'Select-style month trigger',
  'datePicker.demo.selectTrigger.description':
    'Two independent select-styled buttons, each opening its own period picker popover — handy for a "start month / end month" pair of fields.',
  'datePicker.demo.selectTrigger.start': 'Start month',
  'datePicker.demo.selectTrigger.end': 'End month',
  'datePicker.demo.field': 'Month range fields',
  'datePicker.examples.field.description':
    'Two field-style popover triggers for choosing a start and end month in a form layout.',
  'datePicker.demo.field.start': 'Start month',
  'datePicker.demo.field.end': 'End month',
  'datePicker.demo.field.placeholder': 'Select month',
  'datePicker.demo.field.summary': 'Selected range:',
  'datePicker.demo.granularity.month': 'Month',
  'datePicker.demo.granularity.quarter': 'Quarter',
  'datePicker.demo.granularity.year': 'Year',
  'datePicker.demo.mode.single': 'Single',
  'datePicker.demo.mode.range': 'Range',
  'datePicker.demo.mode.multi': 'Multi',
  'datePicker.demo.clear': 'Clear',
  'datePicker.api.id.description':
    'Host id used for field association and imperative focus targeting. Generated when omitted.',
  'datePicker.api.class.description': 'Additional classes merged with the component base styles.',
  'datePicker.api.size.description': 'Size of each grid cell.',
  'datePicker.api.locale.description':
    'Overrides the injected CALENDAR_LOCALE for this instance; only monthLabels is consulted (for month-granularity cell text).',
  'datePicker.api.granularity.description': 'Selection unit rendered by the grid.',
  'datePicker.api.mode.description':
    'Selection behavior: single value, a range, or multiple independent values.',
  'datePicker.api.quarterLabels.description':
    'Display text for the four quarter cells, in fiscal-quarter order.',
  'datePicker.api.yearsToDisplay.description':
    'Number of cells in the year-granularity sliding window.',
  'datePicker.api.gridColumns.description':
    'Grid column count used for arrow-key focus math; defaults to 3 for month/year and 4 for quarter.',
  'datePicker.api.disabled.description':
    'Pass a date matcher (or matcher array) to disable individual periods, or a boolean to disable the entire picker without clearing its value.',
  'datePicker.api.allowDeselect.description':
    'Whether re-picking a selected value in single mode clears it.',
  'datePicker.api.required.description':
    'Marks the picker as required for field integration and aria-required.',
  'datePicker.api.ariaLabel.description':
    'Accessible name for the picker host when no visible label names it.',
  'datePicker.api.ariaLabelledBy.description':
    'ID of visible text that provides the accessible name for the picker host.',
  'datePicker.api.ariaDescribedBy.description':
    'ID of helper text that describes the picker; merged with Field-provided description ids.',
  'datePicker.api.rangePeriodCountLimit.description':
    'Optional min/max period-count bound on range selections.',
  'datePicker.api.prevYearLabel.description':
    'Accessible label for the previous-year navigation button.',
  'datePicker.api.nextYearLabel.description':
    'Accessible label for the next-year navigation button.',
  'datePicker.api.selectedDateChange.description':
    'Emits the selected date whenever it changes (single mode).',
  'datePicker.api.selectedRangeChange.description':
    'Emits the selected range whenever it changes (range mode).',
  'datePicker.api.selectedDatesChange.description':
    'Emits the selected dates whenever they change (multi mode).',
  'datePicker.api.isDraftActive.description': 'Whether a range selection draft is currently open.',
  'datePicker.api.clear.description':
    'Clears the current selection without changing the visible window.',
  'datePicker.api.abortRangeDraft.description':
    'Discards an in-progress range draft without committing it.',
  'datePicker.api.removeDate.description':
    'Removes a single date from the selection (multi mode only).',
  'datePicker.api.focus.description': 'Moves focus to the date-picker host element.',
  'datePicker.accessibility.description':
    "The host group accepts aria-label or aria-labelledby and receives aria-invalid, aria-disabled, and aria-describedby. The calendar panel has role='grid' with an aria-label derived from its header; each role='gridcell' receives its selection, disabled, and required states. Field descriptions are wired automatically.",
  'datePicker.keyboard.description':
    'Calendar grid navigation is handled by @sanring/date-picker-core.',
  'datePicker.keyboard.arrowKeys': 'Navigate between cells in the calendar grid.',
  'datePicker.keyboard.pageUpDown':
    'Previous / next page (month, quarter, or year depending on granularity).',
  'datePicker.keyboard.homeEnd': 'Jump to the first / last cell in the current view.',
  'datePicker.keyboard.enter': 'Select the focused cell.',
  'datePicker.keyboard.escape': 'Close the date-picker popover without committing a selection.',
  'datePicker.stateModel.description':
    'Implements ControlValueAccessor. Use [(ngModel)] or formControl. Value type: DatePickerValue (single date, a range pair, or an array of dates depending on mode). mode and granularity can be changed at runtime.',
} as const;

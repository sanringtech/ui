export const calendarTranslations = {
  'calendar.description':
    'A date grid built on the headless @sanring/date-picker-core engine, supporting single, range, and multi-month selection.',
  'calendar.examples.description':
    'The states below map directly onto @sanring/date-picker-core’s own progressive demo scenarios.',
  'calendar.demo.noDeselect': 'No deselect',
  'calendar.demo.noDeselect.description':
    'allowDeselect = false — clicking the already-selected date again does not clear it.',
  'calendar.demo.disabled': 'With disabled rules',
  'calendar.demo.disabled.description':
    'Weekends (predicate function) plus a 7/20–7/24 break (interval), combined; deselect is also off.',
  'calendar.demo.range': 'Range selection',
  'calendar.demo.range.description':
    'First click sets the start (enters Draft), second click commits the range; "Abort draft" rolls it back.',
  'calendar.demo.multiMonth': 'Multi-month',
  'calendar.demo.multiMonth.description':
    'Two months rendered together; arrow keys move seamlessly between them and only page at the outer edge. orientation is purely presentational — it never changes month order, just flex-direction.',
  'calendar.demo.multiMonth.tab.horizontal': 'Horizontal',
  'calendar.demo.multiMonth.tab.vertical': 'Vertical',
  'calendar.demo.clear': 'Clear',
  'calendar.demo.abortDraft': 'Abort draft',
  'calendar.demo.noSelection': 'Not selected',
  'calendar.demo.selected': 'Selected: ',
  'calendar.demo.rangeStart': 'Start: ',
  'calendar.demo.rangeAwaitingEnd': ' (pick an end date)',
  'calendar.demo.rangeSeparator': ' – ',
  'calendar.demo.weekStart': 'Week start order',
  'calendar.demo.weekStart.description':
    'weekStartsOn reorders the grid itself, not just the header text — swap it independently of any language or label choice.',
  'calendar.demo.weekStart.sunFirst': 'weekStartsOn: 0 (Sunday-first)',
  'calendar.demo.weekStart.monFirst': 'weekStartsOn: 1 (Monday-first)',
  'calendar.demo.customLocale': 'Custom locale',
  'calendar.demo.customLocale.description':
    'weekdayLabels and monthLabels are plain string arrays with no built-in default — swap in any script without touching week-start order.',
  'calendar.demo.customLocale.tab.zh': 'Chinese',
  'calendar.demo.customLocale.tab.ja': 'Japanese',
  'calendar.examples.basic.description':
    'Throws without a locale — CALENDAR_LOCALE has no default, forcing an explicit choice of week start and month/weekday labels. Click the month/year label to jump directly to any month or year.',
  'calendar.usage.description':
    'Import CalendarComponent and provide CALENDAR_LOCALE at the app or component level.',
  'calendar.installation.description':
    'Add the component with the CLI — it also installs @sanring/date-picker-core as a peer dependency — then import CalendarComponent.',
  'calendar.api.description': 'Inputs, outputs, and public methods supported by CalendarComponent.',
  'calendar.api.id.description':
    'Host id used for field association and imperative focus targeting. Generated when omitted.',
  'calendar.api.class.description': 'Additional classes merged with the component base styles.',
  'calendar.api.size.description': 'Size of each day cell.',
  'calendar.api.locale.description':
    'Overrides the injected CALENDAR_LOCALE; falls back to the injected token when omitted.',
  'calendar.api.mode.description':
    'Single or range selection mode; switching resets the current selection.',
  'calendar.api.monthsToDisplay.description': 'Number of months rendered together.',
  'calendar.api.orientation.description':
    'Layout direction for multiple months (monthsToDisplay > 1). Purely presentational — the engine only guarantees array order, not screen position.',
  'calendar.api.disabled.description':
    'Disabled-date matcher: a single date, an array, an interval, or a predicate function.',
  'calendar.api.allowDeselect.description':
    'Whether re-clicking the selected date clears the selection.',
  'calendar.api.required.description':
    'Marks the calendar as required for field integration and aria-required.',
  'calendar.api.ariaDescribedBy.description':
    'ID of helper text that describes the calendar; merged with Field-provided description ids.',
  'calendar.api.prevMonthLabel.description':
    'aria-label for the previous-month button, overridable for i18n.',
  'calendar.api.nextMonthLabel.description':
    'aria-label for the next-month button, overridable for i18n.',
  'calendar.api.jumpMonthLabel.description':
    'aria-label for the month select in the jump popover.',
  'calendar.api.jumpYearLabel.description':
    'aria-label for the year select in the jump popover.',
  'calendar.api.selectedDateChange.description':
    'Emits when the selected date changes in single mode.',
  'calendar.api.isDraftActive.description':
    'In range mode, whether the first endpoint is picked and a second one is pending.',
  'calendar.api.clear.description':
    'Clears the current selection (also discards an in-progress range draft).',
  'calendar.api.abortRangeDraft.description':
    'Aborts an in-progress range draft without touching the committed range.',
  'calendar.api.focus.description': 'Moves focus to the calendar host element.',
  'calendar.api.selectedRangeChange.description':
    'Emits when the selected range changes in range mode.',
  'calendar.accessibility.description': "role='grid' on each month grid, aria-label on the grid from the month/year header, role='gridcell' on each day cell. The host element receives aria-required, aria-invalid, and aria-describedby, auto-wired when nested in sanring-field.",
  'calendar.keyboard.description': 'Day cell navigation is handled by @sanring/date-picker-core.',
  'calendar.keyboard.arrowKeys': 'Move focus between day cells, crossing month boundaries seamlessly when monthsToDisplay > 1.',
  'calendar.keyboard.pageUpDown': 'Previous / next month.',
  'calendar.keyboard.homeEnd': 'First / last day of the visible month.',
  'calendar.keyboard.enter': 'Select or toggle the focused day.',
  'calendar.stateModel.description': 'Implements ControlValueAccessor. Use [(ngModel)] or formControl. Value type: Date | null (single mode) or { start: Date; end: Date } | null (range mode). The abortRangeDraft() and clear() methods are available for programmatic control.',
} as const;

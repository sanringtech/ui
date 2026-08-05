export const tableTranslations = {
  'table.description':
    'Composable CDK table primitives for dense data, sortable headers, empty states, and sticky action columns.',
  'table.examples.basic.description':
    'A compact invoice table using Sanring cell, row, and column directives on top of Angular CDK table.',
  'table.usage.description':
    'Import Angular CDK table plus the Sanring table primitives, then compose columns, cells, and rows in the template.',
  'table.installation.description':
    'Add the component with the CLI, then import the table primitives alongside Angular CDK table.',
  'table.demo.sortable': 'Sortable headers',
  'table.demo.columnSizing': 'Column sizing',
  'table.demo.sticky': 'Sticky columns',
  'table.demo.empty': 'Empty state',
  'table.demo.selection': 'Row selection',
  'table.demo.actions': 'Actions menu',
  'table.demo.pagination': 'With pagination',
  'table.api.description': 'Directives and components provided by the table primitive set.',
  'table.api.sanringTable.description':
    'Applies Sanring table sizing, typography, and reset classes to an Angular CDK table.',
  'table.api.sanringColumnDef.description':
    'Wraps CdkColumnDef and forwards column name plus sticky and stickyEnd inputs.',
  'table.api.cellDef.description': 'Template definitions for header, body, and footer cells.',
  'table.api.cell.description':
    'Rendered header, body, and footer cell directives with Sanring spacing and CDK cell wiring.',
  'table.api.rowDef.description':
    'Template definitions for header, body, and footer rows, including column and sticky inputs.',
  'table.api.row.description':
    'Rendered row directive that applies borders, hover states, and selected state styling.',
  'table.api.sort.description':
    'Coordinates the active column and direction through the sanringSort model input/output.',
  'table.api.sortHeader.description':
    'Interactive header cell that toggles asc, desc, and none states for a column.',
  'table.api.noDataRow.description':
    'Template rendered by CDK table when the data source is empty.',
  'table.accessibility.description': 'Built on semantic HTML (<table>, <thead>, <tbody>, <th>, <td>). Screen readers use the native table role and column headers automatically. Angular CDK CdkTable adds scope attributes to column headers. No additional ARIA is needed for a basic data table.',
  'table.keyboard.description': 'The table itself has no built-in keyboard interaction beyond standard browser table traversal.',
  'table.keyboard.tab': 'Navigate between interactive elements (buttons, links, checkboxes) inside table cells.',
  'table.stateModel.description': 'Stateless — data is driven by Angular template iteration and a CdkTableDataSourceInput (array or DataSource). Sorting, pagination, and row selection state are managed in the host component.',
} as const;

export const resizableTranslations = {
  'resizable.description':
    'Drag-to-resize split panes for editor, dashboard, and inspection layouts.',
  'resizable.examples.basic.description':
    'Compose a group, panels, and a handle. Panels use percentage sizes and respect min/max constraints while dragging.',
  'resizable.usage.description':
    'Import the resizable primitives and place handles between adjacent panels.',
  'resizable.installation.description':
    'Add the component with the CLI, then import ResizableGroupComponent, ResizablePanelComponent, and ResizableHandleComponent.',
  'resizable.examples.controlled.description':
    'Bind [(sizes)] to persist or restore a split layout. The values are percentages for each panel.',
  'resizable.demo.vertical': 'Vertical',
  'resizable.demo.controlled': 'Controlled sizes',
  'resizable.demo.disabled': 'Disabled',
  'resizable.demo.navigation': 'Navigation',
  'resizable.demo.editor': 'Editor',
  'resizable.demo.one': 'One',
  'resizable.demo.two': 'Two',
  'resizable.demo.three': 'Three',
  'resizable.demo.dragHint': 'Drag the handle',
  'resizable.demo.preview': 'Preview',
  'resizable.demo.previewHint': 'Resize vertically to reveal more console space.',
  'resizable.demo.consoleReady': '> preview ready',
  'resizable.demo.consoleResize': '> drag handle to resize panes',
  'resizable.demo.files': 'Files',
  'resizable.demo.canvas': 'Canvas',
  'resizable.demo.inspector': 'Inspector',
  'resizable.demo.resetLayout': 'Reset layout',
  'resizable.demo.lockedPanel': 'Locked panel',
  'resizable.demo.lockedContent':
    'Disabled groups keep the layout visible but block drag and keyboard resizing.',
  'resizable.api.description': 'Inputs and models supported by the resizable primitive set.',
  'resizable.api.direction.description': 'Sets the split axis for the group.',
  'resizable.api.sizes.description':
    'Two-way bindable panel sizes, expressed as percentages. Useful for saving and restoring layouts.',
  'resizable.api.disabled.description': 'Disables pointer and keyboard resizing for the group.',
  'resizable.api.defaultSize.description':
    'Initial panel size in percent before a controlled size exists.',
  'resizable.api.minSize.description': 'Minimum panel size in percent.',
  'resizable.api.maxSize.description': 'Maximum panel size in percent.',
  'resizable.api.collapsible.description':
    'Allows the panel to snap below minSize and collapse to collapsedSize.',
  'resizable.api.collapsedSize.description':
    'Panel size used when a collapsible panel snaps closed, expressed as a percentage.',
  'resizable.api.withHandle.description': 'Renders the visible grip inside the handle.',
  'resizable.api.keyboardStep.description':
    'Percentage step used when resizing with arrow keys. Home and End jump to the panel boundary.',

} as const;

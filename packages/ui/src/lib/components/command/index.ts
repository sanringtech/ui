export * from './command.component';
export * from './command-dialog.component';
export * from './command-empty.component';
export * from './command-group.component';
export * from './command-input.component';
export * from './command-item.component';
export * from './command-list.component';
export * from './command-shortcut.component';

// 便利陣列：imports: [SANRING_COMMAND_IMPORTS] 一行搞定
import { CommandComponent } from './command.component';
import { CommandDialogComponent } from './command-dialog.component';
import { CommandEmptyComponent } from './command-empty.component';
import { CommandGroupComponent } from './command-group.component';
import { CommandInputComponent } from './command-input.component';
import { CommandItemComponent } from './command-item.component';
import { CommandListComponent } from './command-list.component';
import { CommandShortcutComponent } from './command-shortcut.component';

export const SANRING_COMMAND_IMPORTS = [
  CommandComponent,
  CommandDialogComponent,
  CommandEmptyComponent,
  CommandGroupComponent,
  CommandInputComponent,
  CommandItemComponent,
  CommandListComponent,
  CommandShortcutComponent,
];

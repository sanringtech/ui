import { LucideSearch } from '@lucide/angular';
import { Component, computed, inject, input, output } from '@angular/core';
import { cn } from '../shared/utils';
import { CommandComponent } from './command.component';

@Component({
  selector: 'sanring-command-input',
  standalone: true,
  imports: [LucideSearch],
  host: { class: 'block' },
  template: `
    <div class="flex items-center gap-3 border-b border-[var(--sanring-border)] px-4">
      <svg lucideSearch class="size-5 shrink-0 opacity-50"></svg>
      <input
        [class]="inputClass()"
        [placeholder]="placeholder()"
        [value]="command.searchQuery()"
        (input)="onInput($event)"
        autocomplete="off"
        autocorrect="off"
        spellcheck="false"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded="true"
        [attr.aria-controls]="command.listId"
        [attr.aria-activedescendant]="command.activeItemId()"
      />
    </div>
  `,
})
export class CommandInputComponent {
  readonly class = input<string | undefined>();
  readonly placeholder = input('Search...');

  /** 每次輸入變動都會送出目前文字，給想自己接管篩選邏輯（例如 fuzzy match）的消費者用 */
  readonly queryChange = output<string>();

  protected readonly command = inject(CommandComponent);

  protected readonly inputClass = computed(() =>
    cn(
      'flex h-14 w-full rounded-[var(--sanring-radius)] bg-transparent py-3 text-base outline-none',
      'placeholder:text-[var(--sanring-muted)] disabled:cursor-not-allowed disabled:opacity-50',
      this.class(),
    ),
  );

  onInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.command.setSearchQuery(inputElement.value);
    this.queryChange.emit(inputElement.value);
  }
}

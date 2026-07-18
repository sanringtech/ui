import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  SelectComponent,
  SelectContentComponent,
  SelectItemComponent,
  SelectTriggerDirective,
  SelectValueComponent,
} from '../select';
import { cn } from '../shared/utils';

@Component({
  selector: 'sanring-page-size-select',
  standalone: true,
  imports: [
    FormsModule,
    SelectComponent,
    SelectContentComponent,
    SelectItemComponent,
    SelectTriggerDirective,
    SelectValueComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sanring-select [ngModel]="pageSize()" (ngModelChange)="pageSize.set($event)">
      <button sanringSelectTrigger [class]="triggerClass()" [attr.aria-label]="ariaLabel()">
        <sanring-select-value />
      </button>

      <sanring-select-content matchTriggerWidth>
        @for (size of pageSizeOptions(); track size) {
          <sanring-select-item [value]="size">{{ size }}</sanring-select-item>
        }
      </sanring-select-content>
    </sanring-select>
  `,
})
export class PageSizeSelectComponent {
  readonly pageSize = model.required<number>();
  readonly pageSizeOptions = input<readonly number[]>([10, 20, 50, 100]);
  readonly ariaLabel = input('Items per page');
  readonly class = input<string | undefined>();

  protected readonly triggerClass = computed(() => cn('h-9 w-[4.5rem] px-2 text-sm', this.class()));
}

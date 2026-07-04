import { booleanAttribute, computed, Directive, input } from '@angular/core';
import { CdkHeaderRowDef, CdkRowDef, CdkFooterRowDef } from '@angular/cdk/table';
import { cn } from '../../utils';

// ==========================================
// 📦 模具陣營（專門貼在 ng-template 模具上，並把 columns/when/sticky 轉發出去）
// ==========================================
@Directive({
  selector: 'ng-template[sanringHeaderRowDef]',
  standalone: true,
  hostDirectives: [
    {
      directive: CdkHeaderRowDef,
      inputs: ['cdkHeaderRowDef: sanringHeaderRowDef', 'cdkHeaderRowDefSticky: sanringHeaderRowDefSticky'],
    },
  ],
})
export class TableHeaderRowDefDirective {}

@Directive({
  selector: 'ng-template[sanringRowDef]',
  standalone: true,
  hostDirectives: [
    {
      directive: CdkRowDef,
      inputs: ['cdkRowDefColumns: sanringRowDefColumns', 'cdkRowDefWhen: sanringRowDefWhen'],
    },
  ],
})
export class TableRowDefDirective {}

@Directive({
  selector: 'ng-template[sanringFooterRowDef]',
  standalone: true,
  hostDirectives: [
    {
      directive: CdkFooterRowDef,
      inputs: ['cdkFooterRowDef: sanringFooterRowDef', 'cdkFooterRowDefSticky: sanringFooterRowDefSticky'],
    },
  ],
})
export class TableFooterRowDefDirective {}

// ==========================================
// 🧁 蛋糕陣營（CdkHeaderRow/CdkRow/CdkFooterRow 是 Component，不能進 hostDirectives，
// 所以仍需搭配原生 cdk-header-row/cdk-row/cdk-footer-row attribute 一起使用）
// ==========================================
@Directive({
  selector: 'tr[cdk-header-row][sanringRow]',
  standalone: true,
  host: { '[class]': 'rowClass()' },
})
export class TableHeaderRowDirective {
  readonly class = input<string | undefined>();

  protected readonly rowClass = computed(() =>
    cn('border-b border-[var(--sanring-border)]', this.class()),
  );
}

@Directive({
  selector: 'tr[cdk-row][sanringRow]',
  standalone: true,
  host: {
    '[class]': 'rowClass()',
    '[attr.data-state]': 'selected() ? "selected" : null',
    '[attr.aria-selected]': 'selected() ? "true" : null',
  },
})
export class TableRowDirective {
  readonly class = input<string | undefined>();
  readonly selected = input(false, { transform: booleanAttribute });

  protected readonly rowClass = computed(() =>
    cn(
      'border-b border-[var(--sanring-border)] text-[var(--sanring-foreground)] transition-colors',
      '[--sanring-table-row-hover:color-mix(in_srgb,var(--sanring-foreground)_6%,transparent)]',
      '[--sanring-table-row-selected:color-mix(in_srgb,var(--sanring-foreground)_10%,transparent)]',
      'hover:bg-[var(--sanring-table-row-hover)]',
      'data-[state=selected]:bg-[var(--sanring-table-row-selected)]',
      'data-[state=selected]:hover:bg-[var(--sanring-table-row-selected)]',
      'last:border-b-0',
      this.class(),
    ),
  );
}

@Directive({
  selector: 'tr[cdk-footer-row][sanringRow]',
  standalone: true,
  host: { '[class]': 'rowClass()' },
})
export class TableFooterRowDirective {
  readonly class = input<string | undefined>();

  protected readonly rowClass = computed(() =>
    cn(
      'border-t border-[var(--sanring-border)] bg-[var(--sanring-surface-strong)] font-medium text-[var(--sanring-foreground)]',
      this.class(),
    ),
  );
}

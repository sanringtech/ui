import { Component } from '@angular/core';
import { cn } from '@sanring/ui';

const footerClasses = {
  footer: cn('border-t border-[var(--docs-border)] px-8 py-6 text-sm text-[var(--docs-muted)]'),
};

@Component({
  selector: 'app-footer',
  template: `<footer [class]="classes.footer">Sanring UI</footer>`,
})
export class FooterComponent {
  protected readonly classes = footerClasses;
}

import { Component, inject } from '@angular/core';
import { LucideHammer } from '@lucide/angular';
import { AlertComponent, AlertDescriptionDirective, AlertTitleDirective } from '@sanring/ui';
import {
  ComponentPageComponent,
  ComponentPageHeaderComponent,
} from '../../../layouts/component-page';
import { I18nService } from '../../../i18n/i18n.service';
import { datePickerPage } from './date-picker.docs';

@Component({
  selector: 'app-date-picker-page',
  imports: [
    AlertComponent,
    AlertDescriptionDirective,
    AlertTitleDirective,
    ComponentPageComponent,
    ComponentPageHeaderComponent,
    LucideHammer,
  ],
  template: `
    <app-component-page [sections]="page.sections">
      <app-component-page-header
        [componentId]="page.componentId"
        [title]="i18n.t(page.titleKey)"
        [description]="i18n.t(page.descriptionKey)"
      />

      <sanring-alert>
        <svg lucideHammer class="size-4"></svg>
        <h5 sanringAlertTitle>{{ i18n.t('status.wip.title') }}</h5>
        <p sanringAlertDescription>{{ i18n.t('status.wip.description') }}</p>
      </sanring-alert>
    </app-component-page>
  `,
})
export class DatePickerPageComponent {
  protected readonly page = datePickerPage;
  protected readonly i18n = inject(I18nService);
}

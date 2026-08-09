import { CdkTableModule } from '@angular/cdk/table';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { expectNoA11yViolations } from '../../../testing/axe-a11y';
import { TableCaptionDirective } from './caption.directive';
import {
  TableCellDefDirective,
  TableCellDirective,
  TableHeaderCellDefDirective,
  TableHeaderCellDirective,
} from './cell.directive';
import { TableColumnDefDirective } from './column-def.directive';
import {
  TableHeaderRowDefDirective,
  TableHeaderRowDirective,
  TableRowDefDirective,
  TableRowDirective,
} from './row.directive';
import { SortHeaderComponent } from './sort-header.component';
import { SortDirective } from './sort.directive';
import { TableContainerComponent } from './table-container.component';
import { TableDirective } from './table.directive';
import { SortState } from './table.type';

interface Person {
  name: string;
  role: string;
}

@Component({
  imports: [
    CdkTableModule,
    TableContainerComponent,
    TableDirective,
    TableCaptionDirective,
    TableColumnDefDirective,
    TableHeaderCellDefDirective,
    TableCellDefDirective,
    TableHeaderCellDirective,
    TableCellDirective,
    TableHeaderRowDefDirective,
    TableRowDefDirective,
    TableHeaderRowDirective,
    TableRowDirective,
    SortDirective,
    SortHeaderComponent,
  ],
  template: `
    <sanring-table-container class="custom-container">
      <table
        cdk-table
        sanringTable
        class="custom-table"
        [dataSource]="data"
        [sanringSort]="sort"
        (sanringSortChange)="sort = $event"
      >
        <caption sanringCaption class="custom-caption">Team members</caption>

        <ng-container sanringColumnDef="name" [ratio]="2">
          <th sanringSortHeader="name" *sanringHeaderCellDef class="custom-header">Name</th>
          <td sanringCell *sanringCellDef="let person">{{ person.name }}</td>
        </ng-container>

        <ng-container sanringColumnDef="role" width="120px">
          <th sanringHeaderCell *sanringHeaderCellDef>Role</th>
          <td sanringCell *sanringCellDef="let person">{{ person.role }}</td>
        </ng-container>

        <tr cdk-header-row sanringRow *sanringHeaderRowDef="columns"></tr>
        <tr cdk-row sanringRow *sanringRowDef="let row; columns: columns" [selected]="row.name === 'Ada'"></tr>
      </table>
    </sanring-table-container>
  `,
})
class TableTestHost {
  columns = ['name', 'role'];
  data: Person[] = [{ name: 'Ada', role: 'Engineer' }];
  sort: SortState | null = null;
}

describe('TableComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableTestHost],
    }).compileComponents();
  });

  it('renders a native table composition and merges classes', () => {
    const fixture = TestBed.createComponent(TableTestHost);
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('sanring-table-container') as HTMLElement;
    const table = fixture.nativeElement.querySelector('table') as HTMLTableElement;
    const caption = fixture.nativeElement.querySelector('caption') as HTMLTableCaptionElement;

    expect(container.className).toContain('custom-container');
    expect(table.className).toContain('custom-table');
    expect(caption.className).toContain('custom-caption');
    expect(table.textContent).toContain('Ada');
    expect(table.textContent).toContain('Engineer');
  });

  it('marks selected rows and toggles sortable headers', () => {
    const fixture = TestBed.createComponent(TableTestHost);
    fixture.detectChanges();

    const row = fixture.nativeElement.querySelector('tr[cdk-row]') as HTMLTableRowElement;
    const sortHeader = fixture.nativeElement.querySelector('th[sanringSortHeader]') as HTMLElement;
    const sortButton = sortHeader.querySelector('button') as HTMLButtonElement;

    expect(row.getAttribute('data-state')).toBe('selected');
    expect(row.getAttribute('aria-selected')).toBe('true');
    expect(sortHeader.getAttribute('aria-sort')).toBe('none');

    sortButton.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.sort).toEqual({ active: 'name', direction: 'asc' });
    expect(sortHeader.getAttribute('aria-sort')).toBe('ascending');
  });

  it('has no axe-detectable a11y violations', async () => {
    const fixture = TestBed.createComponent(TableTestHost);
    fixture.detectChanges();

    await expectNoA11yViolations(fixture.nativeElement);
  });
});

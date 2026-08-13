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
import { TableNoDataRowDirective } from './no-data-row.directive';
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

  it('renders without error', () => {
    const fixture = TestBed.createComponent(TableTestHost);
    fixture.detectChanges();

    expect(fixture.nativeElement).toBeTruthy();
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

@Component({
  imports: [
    CdkTableModule,
    TableDirective,
    TableColumnDefDirective,
    TableHeaderCellDefDirective,
    TableCellDefDirective,
    TableHeaderCellDirective,
    TableCellDirective,
    TableHeaderRowDefDirective,
    TableRowDefDirective,
    TableHeaderRowDirective,
    TableRowDirective,
    TableNoDataRowDirective,
  ],
  template: `
    <table cdk-table sanringTable [dataSource]="data">
      <ng-container sanringColumnDef="name">
        <th sanringHeaderCell *sanringHeaderCellDef>Name</th>
        <td sanringCell *sanringCellDef="let person">{{ person.name }}</td>
      </ng-container>

      <tr cdk-header-row sanringRow *sanringHeaderRowDef="columns"></tr>
      <tr cdk-row sanringRow *sanringRowDef="let row; columns: columns"></tr>
      <tr *sanringNoDataRow>
        <td class="no-data-cell">Nothing to show</td>
      </tr>
    </table>
  `,
})
class TableNoDataTestHost {
  columns = ['name'];
  data: Person[] = [];
}

describe('TableComponent (no-data row)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableNoDataTestHost],
    }).compileComponents();
  });

  it('shows the no-data row when the data source is empty', () => {
    const fixture = TestBed.createComponent(TableNoDataTestHost);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.no-data-cell')).not.toBeNull();
  });

  it('hides the no-data row once the data source has rows', () => {
    const fixture = TestBed.createComponent(TableNoDataTestHost);
    fixture.componentInstance.data = [{ name: 'Ada', role: 'Engineer' }];
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.no-data-cell')).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Ada');
  });
});

@Component({
  imports: [
    CdkTableModule,
    TableDirective,
    TableColumnDefDirective,
    TableHeaderCellDefDirective,
    TableCellDefDirective,
    TableHeaderCellDirective,
    TableCellDirective,
    TableHeaderRowDefDirective,
    TableRowDefDirective,
    TableHeaderRowDirective,
    TableRowDirective,
  ],
  template: `
    <table cdk-table sanringTable [dataSource]="data">
      <ng-container sanringColumnDef="name" [ratio]="2">
        <th sanringHeaderCell *sanringHeaderCellDef>Name</th>
        <td sanringCell *sanringCellDef="let person">{{ person.name }}</td>
      </ng-container>

      <ng-container sanringColumnDef="role" [ratio]="1">
        <th sanringHeaderCell *sanringHeaderCellDef>Role</th>
        <td sanringCell *sanringCellDef="let person">{{ person.role }}</td>
      </ng-container>

      <ng-container sanringColumnDef="id" width="48px">
        <th sanringHeaderCell *sanringHeaderCellDef>ID</th>
        <td sanringCell *sanringCellDef="let person">{{ person.id }}</td>
      </ng-container>

      <tr cdk-header-row sanringRow *sanringHeaderRowDef="columns"></tr>
      <tr cdk-row sanringRow *sanringRowDef="let row; columns: columns"></tr>
    </table>
  `,
})
class TableColumnSizingTestHost {
  columns = ['name', 'role', 'id'];
  data = [{ name: 'Ada', role: 'Engineer', id: 1 }];
}

describe('TableComponent (column sizing)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableColumnSizingTestHost],
    }).compileComponents();
  });

  it('splits ratio columns proportionally and leaves fixed-width columns untouched by the pool', () => {
    const fixture = TestBed.createComponent(TableColumnSizingTestHost);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const headers = nativeElement.querySelectorAll<HTMLElement>('th[sanringHeaderCell]');

    // ratio 2:1 之間分配 100% —— name 66.67%、role 33.33%；id 是固定寬度，不進比例池
    expect(headers[0].style.width).toBe('66.66666666666666%');
    expect(headers[1].style.width).toBe('33.33333333333333%');
    expect(headers[2].style.width).toBe('48px');
  });

  it('enables fixed table-layout only when a column actually registers a ratio', () => {
    const fixture = TestBed.createComponent(TableColumnSizingTestHost);
    fixture.detectChanges();

    const table = fixture.nativeElement.querySelector('table') as HTMLTableElement;
    expect(table.classList.contains('cdk-table-fixed-layout')).toBe(true);
  });
});

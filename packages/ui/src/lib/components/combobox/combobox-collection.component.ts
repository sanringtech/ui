import { Component } from '@angular/core';

@Component({
  selector: 'sanring-combobox-collection',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    style: 'display: contents;',
  },
})
export class ComboboxCollectionComponent {}

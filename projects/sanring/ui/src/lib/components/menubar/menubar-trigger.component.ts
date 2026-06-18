import { Component } from '@angular/core';

@Component({
  selector: 'sanring-menubar-trigger',
  standalone: true,
  imports: [],
  template: `<button class=""><ng-content></ng-content></button>`,
})
export class MenubarTrigger {}

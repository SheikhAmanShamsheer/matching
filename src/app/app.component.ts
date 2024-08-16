import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template : `
  <app-header></app-header>
  <router-outlet ></router-outlet>
  <app-footer style="padding: 100px;"></app-footer>
  `
})
export class AppComponent {
  title = 'matching';
}

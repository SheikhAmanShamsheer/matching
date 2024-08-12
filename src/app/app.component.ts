import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template : `
  <app-header style="position:sticky"></app-header>
  <router-outlet ></router-outlet>
  <app-footer style="position: absolute; bottom:0; left:0; rigth:0;"></app-footer>
  `
})
export class AppComponent {
  title = 'matching';
}

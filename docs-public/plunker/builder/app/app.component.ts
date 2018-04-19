import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './app.component.html',
  styleUrls: [
    '../assets/themes/metro.css',
    './app.css',
    '../../node_modules/bootstrap/dist/css/bootstrap-grid.css',
    '../../node_modules/font-awesome/css/font-awesome.css'
  ]
})
export class AppComponent {
}

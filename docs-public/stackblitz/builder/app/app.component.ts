import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './app.component.html',
  styles: [
    '@import "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.css"',
    '@import "https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css"'
   ],
   styleUrls: [
    './../assets/themes/metro.css',
    './app.css'
   ]
})
export class AppComponent {
}

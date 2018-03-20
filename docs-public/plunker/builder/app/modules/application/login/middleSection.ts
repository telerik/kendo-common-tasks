/////////////////////////////////////////////////////
// Add your custom code here.
// This file and any changes you make to it are preserved every time the app is generated.
/////////////////////////////////////////////////////
import { Component, Optional } from '@angular/core';
import { LoginComponent } from './login.component';

@Component({
    selector: 'kb-middle-section',
    template: require('./middleSection.html')
})
export class MiddleSectionComponent {
    constructor(@Optional() public parent: LoginComponent) {
    }
}

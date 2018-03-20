/////////////////////////////////////////////////////
// Add your custom code here.
// This file and any changes you make to it are preserved every time the app is generated.
/////////////////////////////////////////////////////
import { Component, Optional } from '@angular/core';
import { UnauthorizedPageComponent } from './unauthorized-page.component';

@Component({
    selector: 'kb-top-section',
    template: require('./topSection.html')
})
export class TopSectionComponent {
    constructor(@Optional() public parent: UnauthorizedPageComponent) {
    }
}

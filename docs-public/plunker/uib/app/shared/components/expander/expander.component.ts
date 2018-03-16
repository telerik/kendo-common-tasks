///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { Component, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
    selector: 'kb-expander',
    templateUrl: './expander.component.html'
})
export class KbExpanderComponent {
    @ViewChild('expanderElement') public expanderElement: ElementRef;

    @Input() public config: any;
    @Input() public id: string;
}

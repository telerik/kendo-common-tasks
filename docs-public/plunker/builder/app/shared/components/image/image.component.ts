///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'kb-image',
    template: require('./image.component.html')
})
export class KbImageComponent {
    @ViewChild('imageElement') public imageElement: ElementRef;

    @Input() public config: any;
    @Input() public id: string;
    @Input() public src: string;
}

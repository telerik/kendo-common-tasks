///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { Component, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { KbNumericInputBaseComponent } from './../numeric-input.base.component';
import { SliderComponent } from '@progress/kendo-angular-inputs';

@Component({
    selector: 'kb-slider',
    templateUrl: './slider.component.html'
})
export class KbSliderComponent extends KbNumericInputBaseComponent {
    @ViewChild('slider') public slider: SliderComponent;

    public shouldValidateComponent(): boolean {
        return false;
    }
}

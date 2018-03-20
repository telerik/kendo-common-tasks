///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { Component, ViewChild } from '@angular/core';
import { KbNumericInputBaseComponent } from './../numeric-input.base.component';
import { NumericTextBoxComponent } from '@progress/kendo-angular-inputs';

@Component({
    selector: 'kb-percent-text-box',
    template: require('./percent-text-box.component.html')
})
export class KbPercentTextBoxComponent extends KbNumericInputBaseComponent {
    @ViewChild('percentInput') public percentInput: NumericTextBoxComponent;
}

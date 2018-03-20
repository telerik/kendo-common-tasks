///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { Component, ViewChild } from '@angular/core';
import { KbNumericInputBaseComponent } from './../numeric-input.base.component';
import { NumericTextBoxComponent } from '@progress/kendo-angular-inputs';

@Component({
    selector: 'kb-currency-text-box',
    template: require('./currency-text-box.component.html')
})
export class KbCurrencyTextBoxComponent extends KbNumericInputBaseComponent {
    @ViewChild('currencyInput') public currencyInput: NumericTextBoxComponent;
}

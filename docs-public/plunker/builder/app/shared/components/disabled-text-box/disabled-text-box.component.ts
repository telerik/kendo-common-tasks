///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { Component, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { KbTextBoxBaseComponent } from './../text-box.base.component';

@Component({
    selector: 'kb-disabled-text-box',
    template: require('./disabled-text-box.component.html')
})
export class KbDisabledTextBoxComponent extends KbTextBoxBaseComponent {
    @ViewChild('disabledInput') public disabledInput: ElementRef;

    public shouldValidateComponent(): boolean {
        return false;
    }

    protected createControl(): FormControl {
        const control: FormControl = new FormControl({ value: this.config.defaultValue, disabled: true }, this.getValidators());
        this.formGroup.addControl(this.id, control);

        return control;
    }
}

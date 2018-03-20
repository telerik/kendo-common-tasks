///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { KbTextBoxBaseComponent } from './../text-box.base.component';
import { CustomValidators } from './../custom-validators';

@Component({
    selector: 'kb-email-text-box',
    template: require('./email-text-box.component.html')
})
export class KbEmailTextBoxComponent extends KbTextBoxBaseComponent {
    @ViewChild('emailInput') public emailInput: ElementRef;

    public shouldValidateComponent(): boolean {
        return true;
    }

    protected getValidators(): Array<any> {
        const validators: Array<any> = super.getValidators();
        validators.push(CustomValidators.mailFormat);
        return validators;
    }

    protected getDefaultValidationMessages(): any {
        const messages: any = super.getDefaultValidationMessages();
        messages['incorrectMail'] = `Entered email is not correct`;
        return messages;
    }
}

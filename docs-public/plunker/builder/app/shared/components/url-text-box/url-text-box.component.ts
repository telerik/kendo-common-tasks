///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { KbTextBoxBaseComponent } from './../text-box.base.component';
import { CustomValidators } from './../custom-validators';

@Component({
    selector: 'kb-url-text-box',
    template: require('./url-text-box.component.html')
})
export class KbUrlTextBoxComponent extends KbTextBoxBaseComponent {
    @ViewChild('urlInput') public urlInput: ElementRef;

    public shouldValidateComponent(): boolean {
        return true;
    }

    protected getValidators(): Array<any> {
        const validators: Array<any> = super.getValidators();
        validators.push(CustomValidators.urlFormat);
        return validators;
    }

    protected getDefaultValidationMessages(): any {
        const messages: any = super.getDefaultValidationMessages();
        messages['invalidUrl'] = `Entered url is not valid`;
        return messages;
    }
}

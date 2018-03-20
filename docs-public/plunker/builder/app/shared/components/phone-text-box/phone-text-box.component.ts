///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { Component, ViewChild, EventEmitter, Input, Output } from '@angular/core';
import { KbInputBaseComponent } from './../input.base.component';
import { MaskedTextBoxComponent } from '@progress/kendo-angular-inputs';

@Component({
    selector: 'kb-phone-text-box',
    template: require('./phone-text-box.component.html')
})
export class KbPhoneTextBoxComponent extends KbInputBaseComponent {
    @ViewChild('phoneInput') public phoneInput: MaskedTextBoxComponent;

    set model(value: string) {
        super.setModel<string>(value);
    }

    @Input() get model(): string {
        return super.getModel<string>();
    }

    public valueChange(value: string): void {
        super.updateModel<string>(value);
    }

    public shouldValidateComponent(): boolean {
        return super.shouldValidateComponent() ||
            this.config.mask !== undefined;
    }

    protected getDefaultValidationMessages(): any {
        const messages: any = super.getDefaultValidationMessages();
        messages['patternError'] = `Phone number is incomplete`;

        return messages;
    }
}

///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { Component, ViewChild, EventEmitter, Input, Output } from '@angular/core';
import { KbInputBaseComponent } from './../input.base.component';
import { MaskedTextBoxComponent } from '@progress/kendo-angular-inputs';

@Component({
    selector: 'kb-masked-text-box',
    template: require('./masked-text-box.component.html')
})
export class KbMaskedTextBoxComponent extends KbInputBaseComponent {
    @ViewChild('maskedInput') public maskedInput: MaskedTextBoxComponent;

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
        messages['patternError'] = `Please populate all symbols`;

        return messages;
    }
}

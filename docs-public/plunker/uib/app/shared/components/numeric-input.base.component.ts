///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { Input, EventEmitter, Output } from '@angular/core';
import { KbInputBaseComponent } from './input.base.component';

export class KbNumericInputBaseComponent extends KbInputBaseComponent {
    @Output() public modelChange: EventEmitter<number> = new EventEmitter();

    set model(value: number) {
        super.setModel<number>(value);
    }

    @Input() get model(): number {
        return super.getModel<number>();
    }

    public valueChange(value: number): void {
        super.updateModel<number>(value);
    }

    public shouldValidateComponent(): boolean {
        return super.shouldValidateComponent() ||
            this.config.min !== undefined ||
            this.config.max !== undefined;
    }

    protected getDefaultValidationMessages(): any {
        const messages: any = super.getDefaultValidationMessages();
        messages['maxError'] = `Please enter a value less than or equal to ${this.config.max}.`;
        messages['minError'] = `Please enter a value greater than or equal to ${this.config.min}.`;

        return messages;
    }
}

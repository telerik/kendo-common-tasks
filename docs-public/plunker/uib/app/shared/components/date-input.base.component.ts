///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { Input, Inject, EventEmitter, Output, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, Validators, FormControl } from '@angular/forms';
import { KbInputBaseComponent } from './input.base.component';
import { ValidationService } from './../services/validation.service';

export abstract class KbDateInputBaseComponent extends KbInputBaseComponent  {
    @Output() public modelChange: EventEmitter<Date> = new EventEmitter();

    set model(value: Date) {
        super.setModel<Date>(value);
    }

    @Input() get model(): Date {
        return super.getModel<Date>();
    }

    public valueChange(value: Date): void {
        super.setModel<Date>(value);
        super.setErrorMessage();
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

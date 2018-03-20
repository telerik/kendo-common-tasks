///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { Component, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { KbInputBaseComponent } from './../input.base.component';

@Component({
    selector: 'kb-boolean-radio-button-list',
    template: require('./boolean-radio-button-list.component.html')
})
export class KbBooleanRadioButtonListComponent extends KbInputBaseComponent {
    @ViewChild('trueRadioButton') public trueRadioButton: ElementRef;
    @ViewChild('falseRadioButton') public falseRadioButton: ElementRef;

    @Output() public modelChange: EventEmitter<boolean> = new EventEmitter();

    set model(value: boolean) {
        super.setModel<boolean>(value);
    }

    @Input() get model(): boolean {
        return super.getModel<boolean>();
    }

    public changeHandler(event: any): void {
        super.updateModel<boolean>(this.formGroup.controls[this.id].value);
    }

    public shouldValidateComponent(): boolean {
        return false;
    }

    public getFirstInputId(): string {
        return `${this.id}_1`;
    }

    public getSecondInputId(): string {
        return `${this.id}_2`;
    }
}

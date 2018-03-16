///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'kb-data-form',
    templateUrl: './data-form.component.html'
})
export class KbDataFormComponent {
    private _model: any;

    @Input() public formGroup: FormGroup;

    @Input() set model(value: any) {
        this._model = value;
        this.formGroup.reset();
    }
}

///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { Component, ViewChild } from '@angular/core';
import { KbDateInputBaseComponent } from './../date-input.base.component';
import { DatePickerComponent, TimePickerComponent } from '@progress/kendo-angular-dateinputs';

@Component({
    selector: 'kb-date-time-picker',
    template: require('./date-time-picker.component.html')
})
export class KbDateTimePickerComponent extends KbDateInputBaseComponent {
    @ViewChild('datePicker') public datePicker: DatePickerComponent;
    @ViewChild('timePicker') public timePicker: TimePickerComponent;
}

///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { Component, ViewChild } from '@angular/core';
import { KbDateInputBaseComponent } from './../date-input.base.component';
import { CalendarComponent } from '@progress/kendo-angular-dateinputs';

@Component({
    selector: 'kb-calendar',
    template: require('./calendar.component.html')
})
export class KbCalendarComponent extends KbDateInputBaseComponent {
    @ViewChild('calendar') public calendar: CalendarComponent;
}

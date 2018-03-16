///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { ChartComponent, SeriesClickEvent } from '@progress/kendo-angular-charts';

export abstract class KbChartsBaseComponent {
    @ViewChild(ChartComponent) public kendoComponent: ChartComponent;
    @Input() public id: string;
    @Input() public data: Array<any>;
    @Input() public model: any;
    @Input() public config: any;
    @Output() public seriesClick: EventEmitter<SeriesClickEvent> = new EventEmitter();

    public seriesClickHandler(seriesClickEvent: SeriesClickEvent): void {
        this.model = seriesClickEvent.dataItem;
        this.seriesClick.emit(seriesClickEvent);
    }
}

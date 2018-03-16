///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { Component, OnChanges } from '@angular/core';
import { KbChartsBaseComponent } from './../charts.base.component';

@Component({
    selector: 'kb-line-charts',
    templateUrl: './line-charts.component.html'
})
export class KbLineChartsComponent extends KbChartsBaseComponent implements OnChanges {
    public categories: Array<any>;

    public ngOnChanges(): void {
        const categoryField = this.config.categoryAxis.field;
        if (categoryField && this.data) {
            this.categories = this.data.map(item => item[categoryField]);
        }
    }
}

///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { Component, OnChanges } from '@angular/core';
import { KbChartsBaseComponent } from './../charts.base.component';

@Component({
    selector: 'kb-bar-charts',
    template: require('./bar-charts.component.html')
})
export class KbBarChartsComponent extends KbChartsBaseComponent  implements OnChanges {
    public categories: Array<any>;

    public ngOnChanges(): void {
        const categoryField = this.config.categoryAxis.field;
        if (categoryField && this.data) {
            this.categories = this.data.map(item => item[categoryField]);
        }
    }
}

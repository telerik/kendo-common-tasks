/////////////////////////////////////////////////////
// Add your custom code here.
// This file and any changes you make to it are preserved every time the app is generated.
/////////////////////////////////////////////////////
import { Component, Optional } from '@angular/core';
import { GridDemoComponent } from './grid-demo.component';

@Component({
    selector: 'kb-top-section',
    templateUrl: './app/topSection.html'
})
export class TopSectionComponent {
    public columns: Array<string> = ['CompanyName', 'ContactName', 'ContactTitle', 'Address'];

    constructor(@Optional() public parent: GridDemoComponent) {
    }

    public togglePaging(checked: boolean): void {
        this.parent.togglePaging(checked);
    }

    public toggleColumnsVisibility(value: Array<string>): void {
        this.parent.toggleColumnsVisibility(value);
    }
}

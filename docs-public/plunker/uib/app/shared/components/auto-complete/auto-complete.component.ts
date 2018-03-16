///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { Component, Input, Output, ViewChild, EventEmitter, OnChanges } from '@angular/core';
import { AutoCompleteComponent } from '@progress/kendo-angular-dropdowns';
import { KbInputBaseComponent } from './../input.base.component';

@Component({
    selector: 'kb-auto-complete',
    templateUrl: './auto-complete.component.html',
    styles: [
        `
        .kb-auto-complete kendo-autocomplete {
            width: 100%;
        }
        `
    ]
})
export class KbAutoCompleteComponent extends KbInputBaseComponent implements OnChanges {
    @ViewChild('kendoComponent') public kendoComponent: AutoCompleteComponent;
    @Input() public name: string;
    @Input() public data: Array<any>;
    @Output() public filterChange: EventEmitter<string> = new EventEmitter();
    public filteredData: Array<any>;

    public ngOnChanges(): void {
        this.filteredData = this.data;
    }

    set model(value: any) {
        super.setModel<any>(value);
    }

    @Input() get model(): any {
        return super.getModel<any>();
    }

    public changeHandler(event: any): void {
        const { value } = this.formGroup.controls[this.id];
        const model = this.config.valuePrimitive && this.config.dataTextField ? value[this.config.dataTextField] : value;
        super.updateModel<any>(model);
    }

    public filterHandler(filterValue: string): void {
        this.filteredData = this.data.filter(item => this.filterItem(item, filterValue));
        this.filterChange.emit(filterValue);
    }

    private filterItem(item: any, filterValue: string): boolean {
        if (!filterValue || !this.config.dataTextField) {
            return true;
        }

        const itemText = item[this.config.dataTextField].toLowerCase();
        const filterText = filterValue.toLowerCase();

        switch (this.config.filter) {
            case 'StartsWith':
                return itemText.indexOf(filterText) === 0;
            case 'EndsWith':
                return itemText.indexOf(filterText, itemText.length - filterText.length) !== -1;
            case 'Contains':
                return itemText.indexOf(filterText) !== -1;
            default:
                return true;
        }
    }
}

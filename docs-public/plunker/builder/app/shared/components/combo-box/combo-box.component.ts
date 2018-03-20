///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { Component, Input, Output, ViewChild, EventEmitter, OnChanges } from '@angular/core';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';
import { KbInputBaseComponent } from './../input.base.component';

@Component({
    selector: 'kb-combo-box',
    template: require('./combo-box.component.html'),
    styles: [
        `
        .kb-combo-box kendo-combobox {
            width: 100%;
        }
        `
    ]
})
export class KbComboBoxComponent extends KbInputBaseComponent implements OnChanges {
    @ViewChild('kendoComponent') public kendoComponent: ComboBoxComponent;
    @Input() public data: Array<any>;
    @Output() public selectionChange: EventEmitter<any> = new EventEmitter();
    @Output() public filterChange: EventEmitter<string> = new EventEmitter();
    public filteredData: Array<any>;

    public ngOnChanges(): void {
        this.filteredData = this.data;
    }

    @Input() get model(): any {
        return super.getModel<any>();
    }

    set model(value: any) {
        super.setModel<any>(value);
    }

    public changeHandler(event: any): void {
        const { value } = this.formGroup.controls[this.id];
        super.updateModel<any>(value);
    }

    public selectionHandler(event: any): void {
        this.selectionChange.emit(event);
    }

    public filterHandler(filterValue: string): void {
        this.filteredData = this.data.filter(item => this.filterItem(item, filterValue));
        this.filterChange.emit(filterValue);
    }

    private filterItem(item: any, filterValue: string): boolean {
        if (!filterValue || !this.config.textField) {
            return true;
        }

        const itemText = item[this.config.textField].toLowerCase();
        const filterText = filterValue.toLowerCase();

        switch (this.config.filter) {
            case 'StartsWith':
                return itemText.indexOf(filterText) === 0;
            case 'EndsWith ':
                return itemText.indexOf(filterText, itemText.length - filterText.length) !== -1;
            case 'Contains':
                return itemText.indexOf(filterText) !== -1;
            case 'None':
            default:
                return true;
        }
    }
}

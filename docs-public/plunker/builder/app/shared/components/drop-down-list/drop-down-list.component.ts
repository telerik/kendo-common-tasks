///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { Component, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { DropDownListComponent } from '@progress/kendo-angular-dropdowns';
import { KbInputBaseComponent } from './../input.base.component';

@Component({
    selector: 'kb-drop-down-list',
    template: require('./drop-down-list.component.html'),
    styles: [
        `
        .kb-drop-down-list kendo-dropdownlist {
            width: 100%;
        }
        `
    ]
})
export class KbDropDownListComponent extends KbInputBaseComponent {
    @ViewChild('kendoComponent') public kendoComponent: DropDownListComponent;
    @Input() public data: Array<any>;
    @Output() public selectionChange: any = new EventEmitter();
    public defaultItem: any;

    public ngOnInit(): void {
        super.ngOnInit();
        this.initDefaultItem();
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

    private initDefaultItem(): void {
        if(this.config.optionLabel) {
            this.defaultItem = {};
            this.defaultItem[this.config.valueField] = null;
            this.defaultItem[this.config.textField] = this.config.optionLabel;
        }
    }
}
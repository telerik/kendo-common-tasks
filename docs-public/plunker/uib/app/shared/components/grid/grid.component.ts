///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { Component, ContentChild, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { GridComponent, GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { Observable } from 'rxjs/Observable';
import { FormGroup } from '@angular/forms';
import { State } from '@progress/kendo-data-query';

import { DataServiceInterface } from '../../../core/data/data-service.interface';

const EDIT_MODE_READ_ONLY = 'ReadOnly';
const EDIT_MODE_INCELL = 'Incell';
const EDIT_MODE_INLINE = 'Inline';
const EDIT_MODE_POPUP = 'Popup';

@Component({
    selector: 'kb-grid',
    templateUrl: './grid.component.html'
})
export class KbGridComponent implements OnInit {
    @ContentChild(GridComponent) public kendoGrid: GridComponent;

    @Input() public config: any;
    @Input() public dataService: DataServiceInterface<any>;
    @Input() public createFormGroup: (args: any) => FormGroup;
    @Output() public add: EventEmitter<any> = new EventEmitter();
    @Output() public edit: EventEmitter<any> = new EventEmitter();

    public state: State = {
        skip: 0
    };

    public view: Observable<GridDataResult>;
    public formGroup: FormGroup = new FormGroup({});
    public isNew: boolean;
    public popupActive = false;
    public editDataModel: any;

    private editedRowIndex: number;

    public ngOnInit(): void {
        this.state.take = this.config.pageSize;
        this.view = this.dataService.dataChanges();
        this.dataService.read(this.state);
    }

    public dataStateChange(gridState: DataStateChangeEvent): void {
        this.state = gridState;
        this.dataService.read(this.state);
    }

    public addHandler({ sender }) {
        this.isNew = true;
        this.add.emit();

        switch (this.config.editing.mode) {
            case EDIT_MODE_INLINE:
                this.closeEditor(sender);
                this.formGroup = this.createFormGroup({ isNew: true });
                sender.addRow(this.formGroup);
                break;

            case EDIT_MODE_POPUP:
                this.popupActive = true;
                break;

            default:
                break;
        }
    }

    public editHandler(event) {
        const { sender, rowIndex, dataItem } = event;

        this.editDataModel = dataItem;
        this.isNew = false;
        this.edit.emit();

        switch (this.config.editing.mode) {
            case EDIT_MODE_INLINE:
                this.closeEditor(sender);
                this.formGroup = this.createFormGroup({ dataItem });
                this.editedRowIndex = rowIndex;
                sender.editRow(rowIndex, this.formGroup);
                break;

            case EDIT_MODE_POPUP:
                this.popupActive = true;
                break;

            default:
                break;
        }
    }

    public cancelHandler({ sender, rowIndex }) {
        this.closeEditor(sender, rowIndex);
    }

    public saveHandler(event) {
        switch (this.config.editing.mode) {
            case EDIT_MODE_INLINE:
                const { sender, rowIndex, formGroup, isNew } = event;
                const item: any = formGroup.value;

                if (isNew) {
                    this.dataService.create(item);
                } else {
                    this.dataService.update(item);
                }

                sender.closeRow(rowIndex);

                break;

            case EDIT_MODE_POPUP:
                if (this.isNew) {
                    this.dataService.create(this.editDataModel);
                } else {
                    this.dataService.update(this.editDataModel);
                }
                this.popupActive = false;
                break;

            default:
                break;
        }

    }

    public removeHandler({ dataItem }) {
        this.dataService.remove(dataItem);
    }

    private closeEditor(grid, rowIndex = this.editedRowIndex) {
        switch (this.config.editing.mode) {
            case EDIT_MODE_INLINE:
                grid.closeRow(rowIndex);
                this.editedRowIndex = undefined;
                this.formGroup = undefined;
                break;

            case EDIT_MODE_POPUP:
                this.popupActive = false;
                break;

            default:
                break;
        }
    }
}

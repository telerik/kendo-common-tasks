///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { Component, ContentChild, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { GridComponent, GridDataResult, DataStateChangeEvent, SelectionEvent } from '@progress/kendo-angular-grid';
import { Observable } from 'rxjs/Observable';
import { FormGroup } from '@angular/forms';
import { State } from '@progress/kendo-data-query';

import { DataServiceInterface, ModelDataResult } from '../../../core/data/data-services.exports';
import { GridIncellEditingService } from '../../services/grid-incell-editing.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

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
    @Input() public state: State = {};
    @Input() public dataService: DataServiceInterface<any>;
    @Input() public view: Observable<GridDataResult>;
    @Input() get model(): any {
        return this._model;
    }
    set model(value: any) {
        this._model = value;
        this.modelChange.emit(value);
    }

    @Output() public add: EventEmitter<any> = new EventEmitter();
    @Output() public edit: EventEmitter<any> = new EventEmitter();
    @Output() public remove: EventEmitter<any> = new EventEmitter();
    @Output() public cellClick: EventEmitter<any> = new EventEmitter();
    @Output() public cellClose: EventEmitter<any> = new EventEmitter();
    @Output() public modelChange: EventEmitter<any> = new EventEmitter();

    public formGroup: FormGroup = new FormGroup({});
    public isNew: boolean;
    public popupActive = false;
    public editDataModel: any;
    public selectedKeys: number[] = [];

    private editedRowIndex: number;
    private incellEditingService: GridIncellEditingService;
    private data: BehaviorSubject<ModelDataResult<any>>;
    private _model: any;

    public ngOnInit(): void {
        if (this.config.editing.mode === EDIT_MODE_INCELL) {
            this.incellEditingService = new GridIncellEditingService(this.dataService, this.state);
            this.data = this.incellEditingService.dataChanges();
            this.view = this.data;
        }
    }

    public selectionChange(e: SelectionEvent): void {
        if (e.selectedRows.length) {
            this.model = e.selectedRows[0].dataItem;
        } else {
            this.model = {};
        }

        if (this.config.events && this.config.events.onRowSelect) {
            this.config.events.onRowSelect(e);
        }
    }

    public dataStateChange(gridState: DataStateChangeEvent): void {
        this.state = gridState;
        if (this.config.serverOperations || this.config.editing.mode !== 'Incell') {
            this.dataService.read(this.state);
        } else {
            this.incellEditingService.read(this.state);
        }
    }

    public addHandler(e) {
        const { sender } = e;
        this.isNew = true;
        this.editDataModel = this.config.createModel();
        this.add.emit();
        if (this.config.events && this.config.events.onRowCreate) {
            this.config.events.onRowCreate(e);
        }

        switch (this.config.editing.mode) {
            case EDIT_MODE_INLINE:
            case EDIT_MODE_INCELL:
                this.closeEditor(sender);
                sender.addRow(this.formGroup);
                break;

            case EDIT_MODE_POPUP:
                this.popupActive = true;
                break;

            default:
                break;
        }
    }

    public editHandler(e) {
        const { sender, rowIndex, dataItem } = e;
        this.editDataModel = dataItem;
        this.isNew = false;
        this.edit.emit();
        if (this.config.events && this.config.events.onRowUpdate) {
            this.config.events.onRowUpdate(e);
        }

        switch (this.config.editing.mode) {
            case EDIT_MODE_INLINE:
                this.closeEditor(sender);
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

    public saveHandler({ sender, rowIndex, formGroup, isNew }) {
        switch (this.config.editing.mode) {
            case EDIT_MODE_INCELL:
                if (formGroup.valid) {
                    this.incellEditingService.create(this.editDataModel);
                    sender.closeRow(rowIndex);
                }
                break;
            case EDIT_MODE_INLINE:
                const item: any = this.editDataModel;

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

    public removeHandler(e) {
        const { sender, dataItem } = e;
        if (this.config.events && this.config.events.onRowDelete) {
            this.config.events.onRowDelete(e);
        }
        if (this.config.editing.mode === EDIT_MODE_INCELL) {
            this.incellEditingService.remove(dataItem);
            sender.cancelCell();
        } else {
            this.remove.emit();
            this.dataService.remove(dataItem);
        }
    }

    // Used in InCell mode
    public saveChanges(): void {
        this.kendoGrid.closeCell();
        this.kendoGrid.cancelCell();

        this.incellEditingService.saveChanges();
    }

    // Used in InCell mode
    public cancelChanges(): void {
        this.kendoGrid.cancelCell();

        this.incellEditingService.cancelChanges();
    }

    // Used in InCell mode
    public cellClickHandler({ sender, rowIndex, columnIndex, dataItem, isEdited }) {
        if (!isEdited) {
            this.editDataModel = dataItem;
            this.cellClick.emit();
            sender.editCell(rowIndex, columnIndex, this.formGroup);
        }
    }

    // Used in InCell mode
    public cellCloseHandler(args: any) {
        const { formGroup } = args;

        this.cellClose.emit();
        if (!formGroup.valid) {
             // prevent closing the edited cell if there are invalid values.
            args.preventDefault();
        } else if (formGroup.dirty) {
            this.incellEditingService.update(this.editDataModel);
        }
    }

    private closeEditor(grid, rowIndex = this.editedRowIndex) {
        switch (this.config.editing.mode) {
            case EDIT_MODE_INLINE:
            case EDIT_MODE_INCELL:
                grid.closeRow(rowIndex);
                this.editedRowIndex = undefined;
                break;

            case EDIT_MODE_POPUP:
                this.popupActive = false;
                break;

            default:
                break;
        }
    }
}

///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ModelDataResult, DataServiceInterface} from '../../core/data/data-services.exports';
import { process, State } from '@progress/kendo-data-query';

export class GridIncellEditingService {
    private data: any[] = [];
    private originalData: any[] = [];
    private createdItems: any[] = [];
    private updatedItems: any[] = [];
    private deletedItems: any[] = [];
    private dataStream: BehaviorSubject<ModelDataResult<any>> = new BehaviorSubject<ModelDataResult<any>>(null);

    constructor(public dataService: DataServiceInterface<any>, private state: State) {
        dataService.dataChanges().subscribe(data => {
            if (data) {
                this.data = dataService.fetchedData().data;
                this.originalData = this.cloneData(this.data);
                this.read(this.state);
            }
        });
    }

    public dataChanges(): BehaviorSubject<ModelDataResult<any>> {
        return this.dataStream;
    }

    public read(state: State): void {
        this.state = state;
        const currentData: ModelDataResult<any> = process(this.data, state);
        return this.dataStream.next(currentData);
    }

    public create(item: any): void {
        this.createdItems.push(item);
        this.data.unshift(item);
        this.read(this.state);
    }

    public update(item: any): void {
        if (!this.isNew(item)) {
            const index = this.itemIndex(item, this.updatedItems);
            if (index !== -1) {
                this.updatedItems.splice(index, 1, item);
            } else {
                this.updatedItems.push(item);
            }
        } else {
            const index = this.itemIndex(item, this.createdItems);
            this.createdItems.splice(index, 1, item);
        }
    }

    public remove(item: any): void {
        const dataItemIndex = this.itemIndex(item, this.data);
        this.data.splice(dataItemIndex, 1);

        const createdItemIndex = this.itemIndex(item, this.createdItems);
        if (createdItemIndex >= 0) {
            this.createdItems.splice(createdItemIndex, 1);
        } else {
            this.deletedItems.push(item);
        }

        const updatedItemIndex = this.itemIndex(item, this.updatedItems);
        if (updatedItemIndex >= 0) {
            this.updatedItems.splice(updatedItemIndex, 1);
        }

        this.read(this.state);
    }

    public hasChanges(): boolean {
        return Boolean(this.deletedItems.length || this.updatedItems.length || this.createdItems.length);
    }

    public isNew(item: any): boolean {
        return this.itemIndex(item, this.createdItems) !== -1;
    }

    public saveChanges(): void {
        this.dataService.batch(this.deletedItems, this.createdItems, this.updatedItems);
        this.reset();
    }

    public cancelChanges(): void {
        this.reset();

        this.data = this.originalData;
        this.originalData = this.cloneData(this.originalData);
        this.read(this.state);
    }

    private reset() {
        this.data = [];
        this.deletedItems = [];
        this.updatedItems = [];
        this.createdItems = [];
    }

    private cloneData(data: any[]) {
        return data.map(item => Object.assign({}, item));
    }

    private itemIndex(item: any, data: any[]): number {
        const itemStringified = JSON.stringify(item);
        for (let idx = 0; idx < data.length; idx++) {
            if (JSON.stringify(data[idx]) === itemStringified) {
                return idx;
            }
        }

        return -1;
    }
}

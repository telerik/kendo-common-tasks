///////////////////
// Auto-generated
// Do not edit!!!
///////////////////

import { Injectable } from '@angular/core';
import { DataResult } from '@progress/kendo-data-query';
import { EventEmitter } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { State } from '@progress/kendo-data-query';

import { DataService } from './data.service';

export class PrimaryKeyField {
    public name: string;
    public type: string;
}

export class DataServiceConfig {
    public dataProviderName: string;
    public serverOperations = false;
    public mapData?: (dataItem: any) => any;
}

export class ModelDataResult<T> implements DataResult {
    public data: T[];
    public total: number;
}

export interface DataServiceInterface<T> {
    errors: BehaviorSubject<Error>;
    events: EventEmitter<DataServiceEvent>;
    fetchedData(): ModelDataResult<T>;
    dataChanges(): BehaviorSubject<ModelDataResult<T>>;
    read(state: State): void;
    create(item: any): void;
    update(item: any): void;
    remove(item: any): void;
    batch(deletedItems: any[], createdItems: any[], updatedItems: any[]): void;
}

export class DataServiceEvent {
    action: string;
}

export class DataServiceRequest {
    url: string;
    routeParams?: { [param: string]: any };
    queryString?: string;
}

export abstract class DataServiceFactory {
    public abstract getService<T>(config: DataServiceConfig): DataService<T>;
}

export class ODataServiceConfig extends DataServiceConfig {
    public tableName: string;
    public primaryKeys: PrimaryKeyField[];
}

@Injectable()
export class DataProviderService {
    public get(providerName: string) {
        return {
            serviceUri: 'https://odatasampleservices.azurewebsites.net/V4/Northwind/Northwind.svc/'
        };
    }
}

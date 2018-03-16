///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { State } from '@progress/kendo-data-query';

import { DataProviderService } from './data-provider.service';
import { DataService } from './data.service';
import { ODataService } from './odata.service';
import { ODataServiceConfig } from './odata-service-config';
import { DataServiceFactory } from './data-service-factory';

@Injectable()
export class ODataServiceFactory extends DataServiceFactory {
    constructor(protected http: HttpClient, protected dataProviderService: DataProviderService) {
        super();
    }

    public getService<T>(config: ODataServiceConfig, state?: State): DataService<T> {
        return new ODataService<T>(config, this.http, this.dataProviderService, state);
    }
}

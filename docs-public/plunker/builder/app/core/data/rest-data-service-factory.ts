///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { State } from '@progress/kendo-data-query';

import { DataProviderService } from './data-provider.service';
import { DataService } from './data.service';
import { RestDataService } from './rest-data.service';
import { RestServiceConfig } from './rest-service-config';
import { DataServiceFactory } from './data-service-factory';

@Injectable()
export class RestDataServiceFactory extends DataServiceFactory {
    constructor(protected http: HttpClient, protected dataProviderService: DataProviderService) {
        super();
    }

    public getService<T>(config: RestServiceConfig, state?: State): DataService<T> {
        return new RestDataService<T>(config, this.http, this.dataProviderService, state);
    }
}

///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { State } from '@progress/kendo-data-query';

import { DataProviderService } from './data-provider.service';
import { DataService } from './data.service';
import { ProgressService } from './progress.service';
import { ProgressServiceConfig } from './progress-service-config';
import { DataServiceFactory } from './data-service-factory';
import { ProgressSessionService } from './progress-session.service';

@Injectable()
export class ProgressServiceFactory extends DataServiceFactory {
    constructor(
        protected http: HttpClient,
        protected dataProviderService: DataProviderService,
        protected sessionService: ProgressSessionService
    ) {
        super();
    }

    public getService<T>(config: ProgressServiceConfig, state?: State): DataService<T> {
        return new ProgressService<T>(config, this.http, this.dataProviderService, this.sessionService, state);
    }
}

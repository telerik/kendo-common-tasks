///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { HttpClient, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { _throw } from 'rxjs/observable/throw';

import { State, toDataSourceRequestString } from '@progress/kendo-data-query';

import { ModelDataResult } from './model-data-result';
import { DataService } from './data.service';
import { RestServiceConfig } from './rest-service-config';
import { DataProviderService } from './data-provider.service';

export class RestDataService<T> extends DataService<T> {
    constructor(protected config: RestServiceConfig, http: HttpClient, dataProviderService: DataProviderService, state: State) {
        super(config, http, dataProviderService, state);
    }

    protected getQueryString(state: State): string {
        return toDataSourceRequestString(state);
    }

    protected readRequest(state: State): Observable<any> {
        if (!this.config.actions.read) {
            return this.unsupportedAction('read');
        }

        const url = this.getAbsoluteUrl({
            url: this.config.actions.read.url,
            queryString: this.getQueryString(state || {})
        });

        return this.http.request(this.config.actions.read.method, url, { observe: 'response' });
    }

    protected createRequest(data: any): Observable<any> {
        if (!this.config.actions.create) {
            return this.unsupportedAction('create');
        }

        const url = this.getAbsoluteUrl({
            url: this.config.actions.create.url
        });

        return this.http.request(this.config.actions.create.method, url, {
            body: data,
            observe: 'response'
        });
    }

    protected updateRequest(data: any): Observable<any> {
        if (!this.config.actions.update) {
            return this.unsupportedAction('update');
        }

        const routeParams = {};

        if (this.config.idField) {
            routeParams[this.config.idField] = data[this.config.idField];
        }

        const url = this.getAbsoluteUrl({
            url: this.config.actions.update.url,
            routeParams
        });

        return this.http.request(this.config.actions.update.method, url, {
            body: data,
            observe: 'response'
        });
    }

    protected removeRequest(data: any): Observable<any> {
        if (!this.config.actions.remove) {
            return this.unsupportedAction('remove');
        }

        const routeParams = {};

        if (this.config.idField) {
            routeParams[this.config.idField] = data[this.config.idField];
        }

        const url = this.getAbsoluteUrl({
            url: this.config.actions.remove.url,
            routeParams
        });

        return this.http.request(this.config.actions.remove.method, url, { observe: 'response' });
    }

    protected parseResponse(response: HttpResponse<Object>): ModelDataResult<T> {
        const result = new ModelDataResult<T>();
        result.data = this.config.dataProperty ? response.body[this.config.dataProperty] : response.body;
        result.total = this.config.totalProperty ? response.body[this.config.totalProperty] : result.data.length;
        return result;
    }

    private unsupportedAction(action: string) {
        return _throw(new Error(`Unsupported Data Service action: ${action}`));
    }
}

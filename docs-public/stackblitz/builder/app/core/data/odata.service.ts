///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { HttpClient, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import { State, toODataString } from '@progress/kendo-data-query';

import { DataService } from './data.service';
import { PrimaryKeyField, ModelDataResult, DataProviderService, ODataServiceConfig } from './data-services.exports';

export class ODataService<T> extends DataService<T> {
    constructor(protected config: ODataServiceConfig, http: HttpClient, dataProviderService: DataProviderService, state: State) {
        super(config, http, dataProviderService, state);
    }

    protected getQueryString(state: State): string {
        return `${toODataString(state)}&$count=true`;
    }

    protected readRequest(state: State): Observable<HttpResponse<Object>> {
        const url = this.getAbsoluteUrl({
            url: this.config.tableName,
            queryString: this.getQueryString(state || {})
        });

        return this.request('GET', url, { observe: 'response' });
    }

    protected createRequest(data: any): Observable<any> {
        const url = this.getAbsoluteUrl({
            url: this.config.tableName
        });

        return this.request('POST', url, {
            body: data,
            observe: 'response'
        });
    }

    protected updateRequest(data: any): Observable<any> {
        const url = this.getAbsoluteUrl({
            url: this.getResourcePath(data)
        });

        return this.request('PUT', url, {
            body: data,
            observe: 'response'
        });
    }

    protected removeRequest(data: any): Observable<any> {
        const url = this.getAbsoluteUrl({
            url: this.getResourcePath(data)
        });

        return this.request('DELETE', url, { observe: 'response' });
    }

    protected parseResponse(response: HttpResponse<Object>): ModelDataResult<T> {
        return {
            data: this.mapData(response.body['value']),
            total: parseInt(response.body['@odata.count'], 10)
        };
    }

    private getResourcePath(data) {
        let keys;

        if (this.config.primaryKeys.length === 1) {
            keys = this.getPrimaryKeyValue(data, this.config.primaryKeys[0]);
        } else {
            keys = this.config.primaryKeys
                .map(item => {
                    return `${item.name}=${this.getPrimaryKeyValue(data, item)}`;
                })
                .join(',');
        }

        return `${this.config.tableName}(${keys})`;
    }

    private getPrimaryKeyValue(data: any, key: PrimaryKeyField) {
        return key.type === 'string' ? `'${data[key.name]}'` : `${data[key.name]}`;
    }
}

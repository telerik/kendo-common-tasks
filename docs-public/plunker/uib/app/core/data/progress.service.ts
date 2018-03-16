///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { Inject } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';
import { pipe } from 'rxjs/util/pipe';

import { State } from '@progress/kendo-data-query';

import { ModelDataResult } from './model-data-result';
import { DataService } from './data.service';
import { ProgressServiceConfig } from './progress-service-config';
import { DataProviderService } from './data-provider.service';
import { ProgressSessionService } from './progress-session.service';

import { progress } from '@progress/jsdo';

export class ProgressService<T> extends DataService<T> {
    private jsdoInstance: progress.data.JSDO;
    private tableRef: string;
    private test: any;

    constructor(
        protected config: ProgressServiceConfig,
        http: HttpClient,
        dataProviderService: DataProviderService,
        private progressSessionService: ProgressSessionService,
        state: State
    ) {
        super(config, http, dataProviderService, state);
    }

    protected readRequest(state: State): Observable<HttpResponse<Object>> {
        return this.getJsdo().pipe(
            switchMap(jsdo => {
                const jsdoState = this.config.serverOperations ? {
                    top: state.take,
                    skip: state.skip,
                    filter: state.filter,
                    sort: state.sort
                } : undefined;
                return this.fill(jsdo, jsdoState);
            })
        );
    }

    protected createRequest(data: any): Observable<any> {
        return this.getJsdo().pipe(
            switchMap(jsdo => {
                jsdo[this.tableRef].add(data);
                return this.saveChanges(jsdo);
            })
        );
    }

    protected updateRequest(data: any): Observable<any> {
        return this.getJsdo().pipe(
            switchMap(jsdo => {
                const item = jsdo[this.tableRef].findById(data._id);
                item.assign(data);
                return this.saveChanges(jsdo);
            })
        );
    }

    protected removeRequest(data: any): Observable<any> {
        return this.getJsdo().pipe(
            switchMap(jsdo => {
                const item = jsdo[this.tableRef].findById(data._id);
                item.remove();
                return this.saveChanges(jsdo);
            })
        );
    }

    protected parseResponse(response: HttpResponse<Object>): ModelDataResult<T> {
        return {
            data: response.body['data'],
            total: response.body['total']
        };
    }

    protected invoke(name: string, params: any): Observable<any> {
        return Observable.create(observer => {
            this.getJsdo().subscribe(jsdo => {
                jsdo.invoke(name, params).done((result, success, request) => {
                    if (success) {
                        observer.next({result, success, request});
                    } else {
                        observer.error((this.getError(result, request)));
                    }
                }).fail((result, success, request) => {
                    observer.error((this.getError(result, request)));
                });
            });
        });
    }

    private fill(jsdo: progress.data.JSDO, jsdoState: { top: number, skip: number, filter: any, sort: any }): Observable<any> {
        return Observable.create(observer => {
            jsdo.fill(jsdoState).done((result, success, request) => {
                if (success) {
                    if (this.config.serverOperations) {
                        const countFnName = this.getCountFnName(jsdo);
                        this.invoke(countFnName, {}).subscribe(val => {
                            const count = parseInt(val.request.response[Object.keys(val.request.response)[0]], 10);
                            observer.next(this.parseJsdoResponse({ result: val.result, count }));
                        }, error => {
                            observer.error(error);
                        });
                    } else {
                        observer.next(this.parseJsdoResponse({ result }));
                    }
                } else {
                    observer.error((this.getError(result, request)));
                }
            }).fail((result, success, request) => {
                observer.error((this.getError(result, request)));
            });
        });
    }

    private getJsdo(): Observable<progress.data.JSDO> {
        const dataProvider = this.dataProviderService.get(this.config.dataProviderName);
        return this.progressSessionService.tryCreateSession(dataProvider, this.config.dataProviderName).pipe(
            switchMap(() => this.getJsdoInstance())
        );
    }

    private getJsdoInstance(): Observable<progress.data.JSDO> {
        return Observable.create(observer => {
            if (!this.jsdoInstance) {
                const tableName = this.config.tableName;
                const resourceName = this.config.resourceName;

                this.jsdoInstance = new progress.data.JSDO({ name: this.config.resourceName });
                if (this.jsdoInstance['_defaultTableRef']) {
                    this.tableRef = this.jsdoInstance['_defaultTableRef']._name;
                } else {
                    // In case when we have more than one table in the resource
                    // resourceName = CustomerOrders, tableName = CustomerOrders.ttCustomer
                    this.tableRef = tableName.replace(`${resourceName}.`, '');
                }
            }
            return observer.next(this.jsdoInstance);
        });
    }

    private saveChanges(jsdo: progress.data.JSDO): Observable<any> {
        return Observable.create(observer => {
            const promise: any = jsdo.saveChanges();
            promise.done((result, success, request) => {
                observer.next();
            }).fail((result, success, request) => {
                observer.error((this.getError(result, request)));
            });
        });
    }

    private getError(jsdo, request): HttpErrorResponse {
        return new HttpErrorResponse({ error: { jsdo, request }, status: request.xhr.status, statusText: request.xhr.statusText });
    }

    private parseJsdoResponse({ result, count }: { result: any, count?: number }): HttpResponse<Object> {
        const tableName = this.config.tableName;
        const resourceName = this.config.resourceName;
        let data: Array<any>;
        // Single resoure with single table
        if (resourceName === tableName) {
            data = result.getData();
        } else {
            data = result[this.tableRef]._data;
        }
        return new HttpResponse({ body: {
            data: data,
            total: count ? count : data.length
        }});
    }

    private getCountFnName(jsdo: progress.data.JSDO): string {
        if (this.config.countFnName) {
            return this.config.countFnName;
        }

        for (const fnName in jsdo['_resource'].fn) {
            if (jsdo['_resource'].generic.count === jsdo['_resource'].fn[fnName]['function']) {
                return fnName;
            }
        }

        return 'count';
    }
}

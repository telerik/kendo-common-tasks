///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { tap } from 'rxjs/operators/tap';
import { map } from 'rxjs/operators/map';
import { publish } from 'rxjs/operators/publish';
import { last } from 'rxjs/operators/last';

import { process, State } from '@progress/kendo-data-query';

import { DataServiceInterface } from './data-service.interface';
import { DataServiceConfig } from './data-service-config';
import { DataServiceRequest } from './data-service-request';
import { ModelDataResult } from './model-data-result';
import { DataProviderService } from './data-provider.service';

export abstract class DataService<T> implements DataServiceInterface<T> {
    public dataResult: ModelDataResult<T>;
    // In case someone wants to refresh the data with the current state
    public state: State;

    private shouldFetch = true;
    private errorStream: BehaviorSubject<Error> = new BehaviorSubject<Error>(null);
    private dataStream: BehaviorSubject<ModelDataResult<T>> = new BehaviorSubject<ModelDataResult<T>>(null);

    constructor(
        protected config: DataServiceConfig,
        protected http: HttpClient,
        protected dataProviderService: DataProviderService,
        protected initialState: State = {}
    ) { }

    public dataChanges(): BehaviorSubject<ModelDataResult<T>> {
        return this.dataStream;
    }

    public errors(): BehaviorSubject<Error> {
        return this.errorStream;
    }

    public read(state?: State): void {
        if (state) {
            this.state = state;
        } else {
            this.state = this.initialState;
        }

        if (!this.config.serverOperations && this.dataResult && this.dataResult.data.length) {
            const currentData: ModelDataResult<T> = process(this.dataResult.data, this.state);
            return this.dataStream.next(currentData);
        }

        if (this.shouldFetch) {
            this.shouldFetch = false;
            const requestState = this.config.serverOperations ? this.state : {};

            this.readRequest(requestState)
                .pipe(
                    map(response => this.parseResponse(response)),
                    tap(data => this.dataResult = data)
                )
                .subscribe(data => {
                    this.shouldFetch = true;

                    if (!this.config.serverOperations) {
                        data = process(data.data, this.state);
                    }

                    this.dataStream.next(data);
                }, (err: HttpErrorResponse) => {
                    this.shouldFetch = true;
                    this.handleError(err);
                    this.dataStream.next(this.dataResult || { data: [], total: 0 });
                });
        }
    }

    public create(item: any): Observable<void> {
        return this.handleRequest(this.createRequest(item));
    }

    public update(item: any): Observable<void> {
        return this.handleRequest(this.updateRequest(item));
    }

    public remove(item: any): Observable<void> {
        return this.handleRequest(this.removeRequest(item));
    }

    protected handleRequest(request: Observable<any>): Observable<void> {
        this.reset();

        const requestObservable = Observable.create(observer => {
            request.subscribe(() => {
                this.read(this.state);
                observer.next();
            }, (err: HttpErrorResponse) => {
                observer.error(err);
                this.handleError(err);
                this.read(this.state);
            });
        }).pipe(
            publish()
        );

        requestObservable.connect();

        return requestObservable.pipe(
            last()
        );
    }

    protected abstract readRequest(state: State): Observable<HttpResponse<Object>>;
    protected abstract createRequest(data: any): Observable<any>;
    protected abstract updateRequest(data: any): Observable<any>;
    protected abstract removeRequest(data: any): Observable<any>;
    protected abstract parseResponse(response: HttpResponse<Object>): ModelDataResult<T>;

    protected getAbsoluteUrl(request: DataServiceRequest): string {
        const dataProvider = this.dataProviderService.get(this.config.dataProviderName);
        let serviceUri = dataProvider ? dataProvider.serviceUri : '';
        serviceUri = serviceUri.replace(/[/]$/, '') + '/';

        const resourceUrl = Object.keys(request.routeParams || {}).reduce((prev, current) => {
            const regEx = new RegExp(':' + current, 'gi');
            return prev.replace(regEx, request.routeParams[current]);

        }, request.url);

        const queryString = request.queryString && request.queryString.length ? '?' + request.queryString : '';

        return `${serviceUri}${resourceUrl}${queryString}`;
    }

    protected getQueryString(state: State): string {
        return '';
    }

    protected handleError(err: HttpErrorResponse) {
        if (err.error instanceof Error) {
            this.errorStream.next(err.error);
        } else {
            this.errorStream.next(new Error(`${err.status} - ${err.statusText}`));
        }
    }

    private reset(): void {
        this.dataResult = null;
    }
}

///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { State } from '@progress/kendo-data-query';

import { ModelDataResult } from './model-data-result';

export interface DataServiceInterface<T> {
    dataChanges(): BehaviorSubject<ModelDataResult<T>>;
    errors(): BehaviorSubject<Error>;
    read(state: State): void;
    create(item: any): Observable<void>;
    update(item: any): Observable<void>;
    remove(item: any): Observable<void>;
}

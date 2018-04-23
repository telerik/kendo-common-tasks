///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { Component, Injector, ViewChild, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { State } from '@progress/kendo-data-query';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { KbGridComponent } from './shared/components/grid/grid.component';

import { DataService } from './core/data/data.service';
import { DataServiceFactory, ModelDataResult } from './core/data/data-services.exports';
import { ODataServiceFactory } from './core/data/odata-service-factory';
import { OdataProviderCustomer } from './data/odata-provider/customer.model';
import { CustomerConfig } from './data/odata-provider/customer.config';

import { map } from 'rxjs/operators/map';

@Component({
    templateUrl: './app/grid-demo.component.html'
})
export class GridDemoBaseComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('grid') public grid: KbGridComponent;

    public $oDataServiceFactory: ODataServiceFactory;
    public $dataServices: { [key: string]: DataService<any> };
    public $dataServicesData: { [key: string]: Observable<any> };
    public $dataServicesResult: { [key: string]: BehaviorSubject<ModelDataResult<any>> };

    public $dataServicesModel: { [key: string]: any } = {
        'Customers': {
            'createModel': () => new OdataProviderCustomer()
        }
    };
    public $dataServicesState: { [key: string]: State } = {
        'Customers': {
            skip: 0,
            take: 5
        }
    };
    public $config: any = {
        title: '<Title>',
        grid: {
            filterable: true,
            groupable: false,
            pageable: this.$dataServicesState['Customers'].take !== undefined,
            pageSize: 5,
            reorderable: false,
            resizable: false,
            sortable: true,
            commandColumnWidth: 220,
            editing: {
                mode: 'ReadOnly'
            },
            events: {
                onRowSelect: (e) => {
                    this['onRowSelect'](e);
                }
            }
        }
    };

    constructor(public injector: Injector) {
        this.$oDataServiceFactory = this.injector.get(ODataServiceFactory);
        this.$dataServices = {
            'Customers': this.$oDataServiceFactory.getService<OdataProviderCustomer>(CustomerConfig, this.$dataServicesState['Customers'])
        };
        this.$dataServicesData = {
            'Customers': this.getDataChanges('Customers')
        };
        this.$dataServicesResult = {
            'Customers': this.getDataResult('Customers')
        };
    }

    public ngOnInit(): void {
        this['onInit']();

        for (const dataSourceName of Object.keys(this.$dataServices)) {
            this.read(dataSourceName);
        }
    }

    public ngAfterViewInit(): void {
        this['onShow']();
    }

    public ngOnDestroy(): void {
        this['onHide']();
    }

    public read(dataSourceName): void {
        this.$dataServices[dataSourceName].read();
    }

    public getDataChanges(dataSourceName): Observable<any[]> {
        const dataService = this.$dataServices[dataSourceName];
        return dataService.dataChanges().pipe(
            map(response => response ? response.data : [])
        );
    }

    public getDataResult(dataSourceName): BehaviorSubject<ModelDataResult<any>> {
        return this.$dataServices[dataSourceName].dataChanges();
    }
}

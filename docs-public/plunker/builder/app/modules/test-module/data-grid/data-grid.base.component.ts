///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { Component, Injector, ViewChild, ViewEncapsulation, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { Observable } from 'rxjs/Observable';

import { KbGridComponent } from '../../../shared/components/grid/grid.component';
import { KbTextBoxComponent } from '../../../shared/components/text-box/text-box.component';

import { DataService } from '../../../core/data/data.service';
import { ODataServiceFactory } from '../../../core/data/odata-service-factory';
import { DataProvider1Person } from '../../../data/data-provider-1/person.model';
import { PersonConfig } from '../../../data/data-provider-1/person.config';

@Component({
    template: require('./data-grid.component.html')
    // styleUrls: ['./data-grid.component.css']
})
export class DataGridBaseComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('grid') public grid: KbGridComponent;

    public $config: any = {
    grid: {
        filterable: false,
        groupable: false,
        pageable: true,
        pageSize: 20,
        reorderable: false,
        resizable: false,
        sortable: false,
        commandColumnWidth: 220,
        editing: {
            mode: 'ReadOnly'
        }
    },
    components: {
    ctl0 : {
    placeholder: '',
    name: 'UserName',
    value: '',
    title: 'UserName',
    debounce: 0
}
 ,
    ctl1 : {
    placeholder: '',
    name: 'FirstName',
    value: '',
    title: 'FirstName',
    debounce: 0
}
 ,
    ctl2 : {
    placeholder: '',
    name: 'LastName',
    value: '',
    title: 'LastName',
    debounce: 0
}
 ,
    ctl3 : {
    placeholder: '',
    name: 'MiddleName',
    value: '',
    title: 'MiddleName',
    debounce: 0
}
 ,
    ctl4 : {
    placeholder: '',
    name: 'Gender',
    value: '',
    title: 'Gender',
    debounce: 0
}
 ,
    ctl5 : {
    placeholder: '',
    downArrowText: '',
        format: 'n0',
    decimals: 0,
                step: 1,
        title: 'Age',
    upArrowText : '',
    spinners: false
}
 ,
    ctl6 : {
    placeholder: '',
    name: 'Emails',
    value: '',
    title: 'Emails',
    debounce: 0
}
 ,
    ctl7 : {
    placeholder: '',
    name: 'AddressInfo',
    value: '',
    title: 'AddressInfo',
    debounce: 0
}
 ,
    ctl8 : {
    placeholder: '',
    name: 'HomeAddress',
    value: '',
    title: 'HomeAddress',
    debounce: 0
}
 ,
    ctl9 : {
    placeholder: '',
    name: 'FavoriteFeature',
    value: '',
    title: 'FavoriteFeature',
    debounce: 0
}
 ,
    ctl10 : {
    placeholder: '',
    name: 'Features',
    value: '',
    title: 'Features',
    debounce: 0
}

}

};

    public $dataService: DataService<DataProvider1Person>;

    protected dataServiceFactory: ODataServiceFactory;
    protected $dataSourceState: {
    skip: 0,
    take: 20
}
;

    constructor(protected injector: Injector) {
        this.dataServiceFactory = injector.get(ODataServiceFactory);
        this.$dataService = this.dataServiceFactory.getService<DataProvider1Person>(PersonConfig, this.$dataSourceState);
    }

    public ngOnInit(): void {
        this['onInit']();
    }

    public ngAfterViewInit(): void {
        this['onShow']();
    }

    public ngOnDestroy(): void {
        this['onHide']();
    }


}

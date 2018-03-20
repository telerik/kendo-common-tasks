///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { Component, OnInit, AfterViewInit, OnDestroy, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthorizationService } from '../../../core/auth/authorization.service';
import { DataService } from '../../../core/data/data.service';
import { DataServiceFactory } from '../../../core/data/data-service-factory';
import { State } from '@progress/kendo-data-query';

@Component({
    selector: 'app-layout',
    template: require('./app-layout.component.html')
    // styles: [require('./app-layout.component.css')]
})
export class  AppLayoutBaseComponent implements OnInit, AfterViewInit, OnDestroy {
    public authorizationService: AuthorizationService;
    public $dataServices: { [key: string]: DataService<any> };
    public $dataServicesData: { [key: string]: Observable<any> };
    public $dataServicesState: { [key: string]: State } = {
    };

    constructor(public injector: Injector) {
        this.$dataServices = {
        };
        this.$dataServicesData = {
        };
        this.authorizationService = this.injector.get(AuthorizationService);

        this.filterNavigationData();
    }

    public $config: any = {
        components: {
            languagesDdl: {}
,
            usernavigation0: {}
,
            contentplaceholder0: {}

        }
    };

    public $dataModels: any = {
    };

    public $navigationData = [
    {
        title: 'TestModule',
        thumbnail: {
            background: '#00a2e8',
            color: '#ffffff',
            icon: 'fa-area-chart'
        },
        children: [
            {
                title: 'DataGrid',
                label: undefined,
                routerLink: '/test-module/data-grid',
                authorization: {
                    allowedRoles: [

                    ]
                }
            }
        ]
    }
]
;

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
        return dataService.dataChanges()
            .map(response => response ? response.data : []);
    }

    private filterNavigationData() {
        this.$navigationData.forEach(module => {
            const views = module.children.filter(
                view => this.authorizationService.isAuthorized(view.authorization));
            module.children = views;
        });

        this.$navigationData = this.$navigationData.filter(module => module.children.length);
    }
}

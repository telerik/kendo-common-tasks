///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { Component, ViewEncapsulation, OnInit, AfterViewInit, OnDestroy, Injector } from '@angular/core';
import { AuthorizationService } from '../../../core/auth/authorization.service';

@Component({
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.css']
})
export class LandingPageBaseComponent implements OnInit, AfterViewInit, OnDestroy {
    public authorizationService: AuthorizationService;

    public modules = [{
        description: '',
        thumbnail: {
            background: '#00a2e8',
            color: '#ffffff',
            icon: 'fa-area-chart',
        },
        label: '',
        name: 'TestModule',
        url: 'test-module',
        children: [{
            name: 'DataGrid',
            routerLink: '/test-module/data-grid',
            authorization: {
    allowedRoles: [

    ]
}

        }]
    }];

    constructor(public injector: Injector) {
        this.authorizationService = this.injector.get(AuthorizationService);

        this.filterModules();
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

    private filterModules(): void {
        this.modules.forEach(module => {
            module.children = module.children.filter(
                view => this.authorizationService.isAuthorized(view.authorization));
        });

        this.modules = this.modules.filter(m => m.children.length);
    }
}

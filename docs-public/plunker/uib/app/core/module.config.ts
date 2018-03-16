///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { HttpClientModule } from '@angular/common/http';

import { DataProviderService } from './data/data-provider.service';
import { ODataServiceFactory } from './data/odata-service-factory';
// import { ProgressServiceFactory } from './data/progress-service-factory';
// import { ProgressSessionService } from './data/progress-session.service';
import { RestDataServiceFactory } from './data/rest-data-service-factory';

import { LocalStorageService } from './auth/local-storage.service';
import { RoleService } from './auth/role.service';
import { AuthorizationService } from './auth/authorization.service';
import { AuthorizationGuardService } from './auth/authorization-guard.service';

export const config = {
    imports: [
        HttpClientModule
    ],
    providers: [
        { provide: 'Window',  useValue: window },
        DataProviderService,
        ODataServiceFactory,
        // ProgressServiceFactory,
        // ProgressSessionService,
        RestDataServiceFactory,
        LocalStorageService,
        RoleService,
        AuthorizationService,
        AuthorizationGuardService,
    ]
};

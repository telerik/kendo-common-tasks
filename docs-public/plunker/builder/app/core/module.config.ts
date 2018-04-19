///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { HttpClientModule } from '@angular/common/http';

import { DataProviderService } from './data/data-services.exports';
import { ODataServiceFactory } from './data/odata-service-factory';

export const config = {
    imports: [
        HttpClientModule
    ],
    providers: [
        { provide: 'Window',  useValue: window },
        DataProviderService,
        ODataServiceFactory
    ]
};

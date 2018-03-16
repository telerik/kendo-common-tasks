///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

@Injectable()
export class DataProviderService {
    public get(providerName: string) {
        return environment.dataProviders[providerName];
    }
}

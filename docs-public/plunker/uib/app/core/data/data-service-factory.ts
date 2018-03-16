///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { DataService } from './data.service';
import { DataServiceConfig } from './data-service-config';

export abstract class DataServiceFactory {
    public abstract getService<T>(config: DataServiceConfig): DataService<T>;
}

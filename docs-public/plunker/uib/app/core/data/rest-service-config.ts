///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { DataServiceConfig } from './data-service-config';

class RestAction {
    method: string;
    url: string;
}

export class RestServiceConfig extends DataServiceConfig {
    public idField?: string;
    public dataProperty?: string;
    public totalProperty?: string;
    public actions: {
        create?: RestAction,
        read?: RestAction,
        update?: RestAction,
        remove?: RestAction
    };
}

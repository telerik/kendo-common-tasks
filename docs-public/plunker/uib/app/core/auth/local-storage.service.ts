///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { Injectable, Inject } from '@angular/core';

const KEY_PREFIX = '$kuib.';

@Injectable()
export class LocalStorageService {
    private storage: Storage;

    constructor(@Inject('Window') window: Window) {
        this.storage = window.localStorage;
    }

    setItem(key: string, value: any): void {
        this.storage.setItem(KEY_PREFIX + key, JSON.stringify(value));
    }

    getItem(key: string): any {
        return JSON.parse(this.storage.getItem(KEY_PREFIX + key));
    }

    public removeItem(key): void {
        this.storage.removeItem(KEY_PREFIX + key);
    }
}

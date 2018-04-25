/////////////////////////////////////////////////////
// Add your custom code here.
// This file and any changes you make to it are preserved every time the app is generated.
/////////////////////////////////////////////////////
import { NgModule, Optional, SkipSelf } from '@angular/core';

import { config } from './module.config';

// You can modify or replace module config here

@NgModule(config)
export class CoreModule {
    // A guard preventing CoreModule to be accidentally imported multiple times
    constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error('CoreModule is already imported in the AppModule');
        }
    }
}

/////////////////////////////////////////////////////
// Add your custom code here.
// This file and any changes you make to it are preserved every time the app is generated.
/////////////////////////////////////////////////////
import { Inject, Injector } from '@angular/core';
import { LandingPageBaseComponent } from './landing-page.base.component';

export class LandingPageComponent extends LandingPageBaseComponent {
    constructor(@Inject(Injector) injector: Injector) {
        super(injector);
    }

    // Fired when component is initialized and input properties are set
    public onInit(): void {
    }
    // Fired when component's views and child views are initialized
    public onShow(): void {
    }
    // Fired just before Angular destroys the component. Unsubscribe Observables and detach event handlers to avoid memory leaks
    public onHide(): void {
    }
}

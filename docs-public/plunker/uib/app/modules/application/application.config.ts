///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { CommonModule } from '@angular/common';
import { SharedModule } from './../../shared/shared.module';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { ApplicationComponent } from './application.component';
import { ApplicationRoutingModule } from './application-routing.module';
import { LandingPageModule } from './landing-page/landing-page.module';
import { LoginModule } from './login/login.module';
import { UnauthorizedPageModule } from './unauthorized-page/unauthorized-page.module';

export const config = {
    declarations: [
        ApplicationComponent
    ],
    entryComponents: [],
    imports: [
        CommonModule,
        SharedModule,
        LayoutModule,
        LandingPageModule,
        LoginModule,
        UnauthorizedPageModule,
        ApplicationRoutingModule
    ],
    exports: [],
    providers: []
};

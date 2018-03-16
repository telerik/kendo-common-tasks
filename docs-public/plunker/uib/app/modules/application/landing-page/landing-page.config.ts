///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { CommonModule } from '@angular/common';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { SharedModule } from './../../../shared/shared.module';
import { LandingPageBaseComponent } from './landing-page.base.component';
import { LandingPageComponent } from './landing-page.component';
import { LandingPageRoutingModule } from './landing-page-routing.module';
import { BottomSectionComponent } from './bottomSection';
import { TopSectionComponent } from './topSection';

export const config = {
    declarations: [
        LandingPageBaseComponent,
        LandingPageComponent,
        BottomSectionComponent,
        TopSectionComponent
    ],
    entryComponents: [],
    exports: [
        BottomSectionComponent,
        TopSectionComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        LayoutModule,
        LandingPageRoutingModule

    ],
    providers: []
};

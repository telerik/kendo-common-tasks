///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { CommonModule } from '@angular/common';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { SharedModule } from './../../../shared/shared.module';
import { UnauthorizedPageBaseComponent } from './unauthorized-page.base.component';
import { UnauthorizedPageComponent } from './unauthorized-page.component';
import { BottomSectionComponent } from './bottomSection';
import { TopSectionComponent } from './topSection';

export const config = {
    declarations: [
        UnauthorizedPageBaseComponent,
        UnauthorizedPageComponent,
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
        LayoutModule
    ],
    providers: []
};

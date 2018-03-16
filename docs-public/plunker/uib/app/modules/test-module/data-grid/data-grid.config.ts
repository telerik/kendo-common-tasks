///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { CommonModule } from '@angular/common';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { SharedModule } from './../../../shared/shared.module';
import { DataGridBaseComponent } from './data-grid.base.component';
import { DataGridComponent } from './data-grid.component';
import { BottomSectionComponent } from './bottomSection';
import { MiddleSectionComponent } from './middleSection';
import { TopSectionComponent } from './topSection';

export const config = {
    declarations: [
        DataGridBaseComponent,
        DataGridComponent,
        BottomSectionComponent,
        MiddleSectionComponent,
        TopSectionComponent
    ],
    entryComponents: [],
    exports: [
        BottomSectionComponent,
        MiddleSectionComponent,
        TopSectionComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        LayoutModule
    ],
    providers: []
};

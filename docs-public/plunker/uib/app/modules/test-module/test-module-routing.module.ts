///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestModuleComponent } from './test-module.component';
import { DataGridComponent } from './data-grid/data-grid.component';
import { AuthorizationGuardService } from './../../core/auth/authorization-guard.service';

const routes: Routes = [
    {
        path: '',
        component: TestModuleComponent,
        children: [{
            path: '',
            redirectTo: 'data-grid',
            pathMatch: 'full'
        }, {
            path: 'data-grid',
            component: DataGridComponent
        }]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class TestModuleRoutingModule { }


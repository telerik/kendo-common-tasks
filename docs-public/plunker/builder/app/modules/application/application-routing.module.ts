///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UnauthorizedPageComponent } from './unauthorized-page/unauthorized-page.component';
import { AuthorizationGuardService } from './../../core/auth/authorization-guard.service';

const routes: Routes = [
    {
        path: 'test-module',
        loadChildren: './app/modules/test-module/test-module.module#TestModuleModule'
    },
    {
        path: 'application',
        children: [
            {
                path: 'login',
                component: LoginComponent
            },
            {
                path: 'forbidden',
                component: UnauthorizedPageComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class ApplicationRoutingModule { }


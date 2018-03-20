///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { Injectable } from '@angular/core';
import { AuthorizationService } from './authorization.service';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable()
export class AuthorizationGuardService implements CanActivate {
    constructor(
        private authorizationService: AuthorizationService,
        private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        if (!route.data) {
            return  true;
        }

        const isAuthorized = this.authorizationService.isAuthorized(route.data.authorization);
        if (!isAuthorized) {
            this.router.navigate(['application/forbidden']);
        }

        return isAuthorized;
    }
}

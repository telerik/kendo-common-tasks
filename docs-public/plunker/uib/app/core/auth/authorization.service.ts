///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { Injectable, Inject } from '@angular/core';
import { RoleService } from './role.service';

@Injectable()
export class AuthorizationService {
    constructor(private roleService: RoleService) {
    }

    public isAuthorized(authorization): boolean {
        if (authorization && authorization.allowedRoles && authorization.allowedRoles.length) {
            return this.isAuthorizedForRoles(authorization.allowedRoles);
        } else {
            return true;
        }
    }

    public isAuthorizedForRoles(roles): boolean {
        const userRoles = this.roleService.getRoles();
        if (userRoles && userRoles.length) {
            const foundUserRoles = roles.filter(elem => userRoles.indexOf(elem) > -1);
            return foundUserRoles.length > 0;
        }

        return false;
    }
}

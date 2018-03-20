///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { Directive, Input, ElementRef, Renderer2, OnInit } from '@angular/core';
import { AuthorizationService } from './../../core/auth/authorization.service';

@Directive({
  selector: '[kbShowForRoles]'
})
export class ShowForRolesDirective implements OnInit {
    @Input() public kbShowForRoles: any;

    constructor(private el: ElementRef, private renderer: Renderer2, private authorizationService: AuthorizationService) {
    }

    public ngOnInit(): void  {
        const requiredRoles = JSON.parse(this.kbShowForRoles);
        if (requiredRoles.length && !this.authorizationService.isAuthorizedForRoles(requiredRoles)) {
            this.clearContent();
        }
    }

    private clearContent(): void {
        for (let child of this.el.nativeElement.children) {
            this.renderer.removeChild(this.el.nativeElement, child);
        }
    }
}

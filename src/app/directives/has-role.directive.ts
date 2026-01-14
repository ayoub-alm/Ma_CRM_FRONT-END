import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import RbacService, { UserPermissions } from '../../services/rbac.service';
import { LocalStorageService } from '../../services/local.storage.service';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({
    selector: '[hasRole]',
    standalone: true
})
export class HasRoleDirective implements OnInit, OnDestroy {
    private role: string = '';
    private user: UserPermissions | null = null;
    private destroy$ = new Subject<void>();

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private localStorageService: LocalStorageService
    ) { }

    @Input() set hasRole(role: string) {
        this.role = role;
        this.updateView();
    }

    ngOnInit() {
        // Load user permissions from localStorage
        this.loadUserPermissions();

        // Check for permission updates every 5 seconds
        interval(5000).pipe(
            takeUntil(this.destroy$)
        ).subscribe(() => {
            this.loadUserPermissions();
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private loadUserPermissions(): void {
        const userPermissionsStr = this.localStorageService.getItem('user_permissions');
        if (userPermissionsStr) {
            try {
                const newUser = JSON.parse(userPermissionsStr);
                // Only update if permissions changed
                if (JSON.stringify(this.user) !== JSON.stringify(newUser)) {
                    this.user = newUser;
                    this.updateView();
                }
            } catch (e) {
                console.error('Error parsing user permissions:', e);
                this.user = null;
                this.updateView();
            }
        } else {
            this.user = null;
            this.updateView();
        }
    }

    private updateView(): void {
        if (this.user && RbacService.hasRole(this.user, this.role)) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainer.clear();
        }
    }
}

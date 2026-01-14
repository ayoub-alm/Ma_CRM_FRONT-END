import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../services/local.storage.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(
        private router: Router,
        private localStorageService: LocalStorageService
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const token = this.localStorageService.getItem('access_token');

        if (token) {
            // Check if token is expired
            if (this.isTokenExpired(token)) {
                console.warn('Token expired, clearing session...');
                this.clearSession();
                return this.router.createUrlTree(['/login'], {
                    queryParams: { returnUrl: state.url }
                });
            }
            return true;
        }

        // Not logged in, redirect to login page
        console.warn('No token found, redirecting to login...');
        return this.router.createUrlTree(['/login'], {
            queryParams: { returnUrl: state.url }
        });
    }

    private isTokenExpired(token: string): boolean {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expiry = payload.exp;
            const now = Math.floor((new Date()).getTime() / 1000);
            return now >= expiry;
        } catch (e) {
            console.error('Error parsing token:', e);
            return true;
        }
    }

    private clearSession(): void {
        this.localStorageService.removeItem('access_token');
        this.localStorageService.removeItem('refresh_token');
        this.localStorageService.removeItem('user_permissions');
        this.localStorageService.removeItem('user');
    }
}

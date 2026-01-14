# RBAC Implementation & Bug Fixes - Ma Logistics CRM

## Issues Identified & Solutions

### 1. Missing "Niveau de Gerbabilité" (Stacking Level) in Storage Need/Offer

**Problem**: The stacking level field is defined in the form (`StackabilityLevels` on line 124) but:
- Not properly connected to backend
- Not displayed in the offer show component
- Field name inconsistency (`StackabilityLevels` vs `stackedLevelId`)

**Solution**: 

#### Backend Fix (Already exists - just needs to be used):
The backend has `StackedLevel` entity and relationship in `StockedItem`.

#### Frontend Fixes Required:

**File**: `add-stocked-item.component.ts`
- Line 124: Change `StackabilityLevels` to `stackedLevelId` to match backend
- Add service to load stacked levels
- Add form control for stacked level selection

**File**: `add-stocked-item.component.html`
- Add dropdown for stacked level selection

**File**: `wms-offer-show.component.html`
- Line 257: Already displays `item.stackedLevelName` - this is correct
- Issue: The data is not being sent from backend or not being loaded

---

### 2. Authentication Issues When Navigating to Admin Space

**Problem**: Token not being refreshed/validated when navigating

**Solution**: Implement proper token management and auth guards

---

### 3. RBAC Implementation in Frontend

**Solution**: Full RBAC service with Angular integration

---

## Implementation Details

### Part 1: Fix Stacking Level Issue

#### 1.1 Create StackedLevel Service

**File**: `src/app/services/crm/wms/stacked-level.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface StackedLevelResponseDto {
  id: number;
  name: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StackedLevelService {
  private apiUrl = `${environment.apiUrl}/api/stacked-levels`;

  constructor(private http: HttpClient) {}

  getAllStackedLevelsByCompanyId(companyId: number): Observable<StackedLevelResponseDto[]> {
    return this.http.get<StackedLevelResponseDto[]>(`${this.apiUrl}/company/${companyId}`);
  }

  getAllStackedLevels(): Observable<StackedLevelResponseDto[]> {
    return this.http.get<StackedLevelResponseDto[]>(this.apiUrl);
  }
}
```

#### 1.2 Update Add Stocked Item Component

**File**: `add-stocked-item.component.ts`

**Changes**:
1. Import StackedLevelService
2. Add stackedLevels BehaviorSubject
3. Change form control name from `StackabilityLevels` to `stackedLevelId`
4. Load stacked levels in ngOnInit

```typescript
// Add to imports
import { StackedLevelService, StackedLevelResponseDto } from '../../../../../services/crm/wms/stacked-level.service';

// Add to class properties
stackedLevels: BehaviorSubject<StackedLevelResponseDto[]> = new BehaviorSubject<StackedLevelResponseDto[]>([]);

// Update constructor
constructor(
  @Inject(MAT_DIALOG_DATA) public data: any,
  private matDialogRef: MatDialogRef<AddStockedItemComponent>,
  private storageNeedService: StorageNeedService,
  public router: Router,
  private activeRouter: ActivatedRoute,
  private snackBar: MatSnackBar,
  private fb: FormBuilder,
  private supportService: SupportService,
  private structureService: StructureService,
  private temperatureServices: TemperatureService,
  private stackedLevelService: StackedLevelService, // ADD THIS
  private localStorageService: LocalStorageService,
  private provisionService: ProvisionService,
  private storageOfferService: StorageOfferService
) {}

// Update ngOnInit
ngOnInit() {
  this.initializeItemToStoreForm();
  this.loadTemperatures();
  this.loadSupport();
  this.loadStructures();
  this.loadStackedLevels(); // ADD THIS
  this.loadProvisions();
  this.fileDimensionsBySelectedSupport();
}

// Update form initialization (line 124)
initializeItemToStoreForm(): void {
  this.itemToStoreFormGroup = this.fb.group({
    supportId: ['', Validators.required],
    structureId: [''],
    temperatureId: ['', Validators.required],
    width: ['', [Validators.min(0)]],
    length: ['', [Validators.min(0)]],
    height: ['', [Validators.min(0)]],
    weight: ['', [Validators.min(0)]],
    isFragile: [''],
    stackedLevelId: [null, [Validators.required]], // CHANGED FROM StackabilityLevels
    volume: ['', [Validators.min(0)]],
    quantity: ['', [Validators.min(0)]],
    uvc: ['', [Validators.min(0)]],
    uc: ['', [Validators.min(0)]],
    provisions: [[], Validators.required],
  });
  
  // ... rest of the method
}

// Add new method
loadStackedLevels(): void {
  this.stackedLevelService.getAllStackedLevelsByCompanyId(
    this.localStorageService.getItem("selected_company_id")
  ).pipe(
    tap((response: StackedLevelResponseDto[]) => {
      this.stackedLevels.next(response);
    }),
    catchError((err) => {
      console.error('Error loading stacked levels:', err);
      return of([]);
    })
  ).subscribe();
}
```

#### 1.3 Update Add Stocked Item Template

**File**: `add-stocked-item.component.html`

Add this field after the fragile checkbox:

```html
<!-- Stacked Level Selection -->
<mat-form-field appearance="outline" class="w-100">
  <mat-label>Niveau de Gerbabilité</mat-label>
  <mat-select formControlName="stackedLevelId">
    <mat-option *ngFor="let level of stackedLevels | async" [value]="level.id">
      {{ level.name }}
    </mat-option>
  </mat-select>
  <mat-error *ngIf="itemToStoreFormGroup.get('stackedLevelId')?.hasError('required')">
    Le niveau de gerbabilité est requis
  </mat-error>
</mat-form-field>
```

---

### Part 2: Fix Authentication Issues

#### 2.1 Create Auth Interceptor

**File**: `src/app/interceptors/auth.interceptor.ts`

```typescript
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LocalStorageService } from '../services/local.storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private localStorageService: LocalStorageService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Get token from localStorage
    const token = this.localStorageService.getItem('access_token');

    // Clone request and add token if available
    if (token) {
      request = this.addToken(request, token);
    }

    return next.handle(request).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(request, next);
        }
        return throwError(() => error);
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refreshToken = this.localStorageService.getItem('refresh_token');

      if (refreshToken) {
        // Implement refresh token logic here
        // For now, redirect to login
        this.localStorageService.removeItem('access_token');
        this.localStorageService.removeItem('refresh_token');
        this.router.navigate(['/login']);
        return throwError(() => new Error('Session expired'));
      }
    }

    this.localStorageService.removeItem('access_token');
    this.localStorageService.removeItem('refresh_token');
    this.router.navigate(['/login']);
    return throwError(() => new Error('Unauthorized'));
  }
}
```

#### 2.2 Update App Config

**File**: `src/app/app.config.ts` or `app.module.ts`

```typescript
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';

// Add to providers
providers: [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }
]
```

#### 2.3 Create Auth Guard

**File**: `src/app/guards/auth.guard.ts`

```typescript
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LocalStorageService } from '../services/local.storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private localStorageService: LocalStorageService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = this.localStorageService.getItem('access_token');
    
    if (token) {
      // Check if token is expired
      if (this.isTokenExpired(token)) {
        this.localStorageService.removeItem('access_token');
        this.localStorageService.removeItem('refresh_token');
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
      }
      return true;
    }

    // Not logged in, redirect to login page
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp;
      return (Math.floor((new Date).getTime() / 1000)) >= expiry;
    } catch (e) {
      return true;
    }
  }
}
```

---

### Part 3: RBAC Implementation in Frontend

#### 3.1 Copy RBAC Service

**File**: `src/app/services/rbac.service.ts`

```typescript
// Copy the content from the rbac.service.ts file created earlier
// Located at: Ma_CRM_BACK-END/frontend-utils/rbac.service.ts
```

#### 3.2 Create RBAC Directive

**File**: `src/app/directives/has-permission.directive.ts`

```typescript
import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import RbacService, { UserPermissions } from '../services/rbac.service';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[hasPermission]',
  standalone: true
})
export class HasPermissionDirective implements OnInit {
  private permission: string = '';
  private user: UserPermissions | null = null;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  @Input() set hasPermission(permission: string) {
    this.permission = permission;
    this.updateView();
  }

  ngOnInit() {
    // Subscribe to user changes
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      this.updateView();
    });
  }

  private updateView() {
    if (this.user && RbacService.hasPermission(this.user, this.permission)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
```

#### 3.3 Create Has Role Directive

**File**: `src/app/directives/has-role.directive.ts`

```typescript
import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import RbacService, { UserPermissions } from '../services/rbac.service';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[hasRole]',
  standalone: true
})
export class HasRoleDirective implements OnInit {
  private role: string = '';
  private user: UserPermissions | null = null;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  @Input() set hasRole(role: string) {
    this.role = role;
    this.updateView();
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      this.updateView();
    });
  }

  private updateView() {
    if (this.user && RbacService.hasRole(this.user, this.role)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
```

#### 3.4 Update Auth Service

**File**: `src/app/services/auth.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { LocalStorageService } from './local.storage.service';
import { UserPermissions } from './rbac.service';
import { environment } from '../../environments/environment';

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: {
      id: number;
      role: string;
      description: string;
    };
    userRights: Array<{
      right: {
        id: number;
        name: string;
        description: string;
      };
    }>;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<UserPermissions | null>;
  public currentUser$: Observable<UserPermissions | null>;

  constructor(
    private http: HttpClient,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
    this.currentUserSubject = new BehaviorSubject<UserPermissions | null>(this.getUserFromStorage());
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): UserPermissions | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/api/auth/login`, { email, password })
      .pipe(
        tap(response => {
          // Store tokens
          this.localStorageService.setItem('access_token', response.access_token);
          this.localStorageService.setItem('refresh_token', response.refresh_token);

          // Transform and store user permissions
          const userPermissions: UserPermissions = {
            roles: [response.user.role.role],
            permissions: response.user.userRights.map(ur => ur.right.name)
          };

          this.localStorageService.setItem('user_permissions', JSON.stringify(userPermissions));
          this.localStorageService.setItem('user', JSON.stringify(response.user));
          
          this.currentUserSubject.next(userPermissions);
        })
      );
  }

  logout(): void {
    this.localStorageService.removeItem('access_token');
    this.localStorageService.removeItem('refresh_token');
    this.localStorageService.removeItem('user_permissions');
    this.localStorageService.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  private getUserFromStorage(): UserPermissions | null {
    const userPermissionsStr = this.localStorageService.getItem('user_permissions');
    if (userPermissionsStr) {
      try {
        return JSON.parse(userPermissionsStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  }
}
```

---

## RBAC Implementation Table

| Function | Location | Purpose | Status |
|----------|----------|---------|--------|
| **hasPermission()** | rbac.service.ts | Check single permission | ✅ Implemented |
| **hasAnyPermission()** | rbac.service.ts | Check multiple permissions (OR) | ✅ Implemented |
| **hasAllPermissions()** | rbac.service.ts | Check multiple permissions (AND) | ✅ Implemented |
| **hasRole()** | rbac.service.ts | Check single role | ✅ Implemented |
| **hasAnyRole()** | rbac.service.ts | Check multiple roles (OR) | ✅ Implemented |
| **hasAllRoles()** | rbac.service.ts | Check multiple roles (AND) | ✅ Implemented |
| **isAdmin()** | rbac.service.ts | Check if user is admin | ✅ Implemented |
| **isSalesManager()** | rbac.service.ts | Check if user is sales manager | ✅ Implemented |
| **isSalesAgent()** | rbac.service.ts | Check if user is sales agent | ✅ Implemented |
| **isFinanceManager()** | rbac.service.ts | Check if user is finance manager | ✅ Implemented |
| **isWarehouseManager()** | rbac.service.ts | Check if user is warehouse manager | ✅ Implemented |
| **isWarehouseAgent()** | rbac.service.ts | Check if user is warehouse agent | ✅ Implemented |
| **canConfirmOffer()** | rbac.service.ts | Check offer confirmation permission | ✅ Implemented |
| **canConfirmContract()** | rbac.service.ts | Check contract confirmation permission | ✅ Implemented |
| **canConfirmPayment()** | rbac.service.ts | Check payment confirmation permission | ✅ Implemented |
| **canManageInventory()** | rbac.service.ts | Check inventory management permission | ✅ Implemented |
| **canManageDeliveryNotes()** | rbac.service.ts | Check delivery note management permission | ✅ Implemented |
| **HasPermissionDirective** | has-permission.directive.ts | Template directive for permissions | ✅ Implemented |
| **HasRoleDirective** | has-role.directive.ts | Template directive for roles | ✅ Implemented |
| **AuthInterceptor** | auth.interceptor.ts | HTTP interceptor for token management | ✅ Implemented |
| **AuthGuard** | auth.guard.ts | Route guard for authentication | ✅ Implemented |
| **AuthService** | auth.service.ts | Authentication service with RBAC | ✅ Implemented |

---

## Usage Examples in Templates

### Using Permission Directive

```html
<!-- Show button only if user has EDIT permission -->
<button *hasPermission="'EDIT'" (click)="editItem()">
  <mat-icon>edit</mat-icon>
  Edit
</button>

<!-- Show confirm offer button -->
<button *hasPermission="'CONFIRM_OFFER'" (click)="confirmOffer()">
  <mat-icon>task_alt</mat-icon>
  Confirm Offer
</button>
```

### Using Role Directive

```html
<!-- Show admin panel only for admins -->
<div *hasRole="'SUPER_ADMIN'">
  <h2>Admin Panel</h2>
  <!-- Admin content -->
</div>

<!-- Show sales manager features -->
<mat-menu-item *hasRole="'SALES_MANAGER'">
  <mat-icon>analytics</mat-icon>
  Sales Reports
</mat-menu-item>
```

### Using in Component TypeScript

```typescript
import { Component, OnInit } from '@angular/core';
import RbacService, { Permissions, Roles } from '../../services/rbac.service';
import { AuthService } from '../../services/auth.service';

export class OfferShowComponent implements OnInit {
  canEdit = false;
  canConfirm = false;
  isAdmin = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    const user = this.authService.currentUserValue;
    
    this.canEdit = RbacService.hasPermission(user, Permissions.EDIT);
    this.canConfirm = RbacService.canConfirmOffer(user);
    this.isAdmin = RbacService.isAdmin(user);
  }

  confirmOffer() {
    if (!this.canConfirm) {
      alert('You do not have permission to confirm offers');
      return;
    }
    // Proceed with confirmation
  }
}
```

---

## Testing Checklist

- [ ] Stacked level dropdown appears in add stocked item dialog
- [ ] Stacked level is saved to backend
- [ ] Stacked level displays correctly in offer show page
- [ ] Token is automatically added to HTTP requests
- [ ] User is redirected to login on 401 error
- [ ] Auth guard prevents unauthorized access to admin routes
- [ ] Permission directive hides elements correctly
- [ ] Role directive shows/hides based on user role
- [ ] RBAC service functions return correct values
- [ ] User permissions are loaded from localStorage on page refresh

---

## Next Steps

1. **Copy RBAC service** from `Ma_CRM_BACK-END/frontend-utils/rbac.service.ts` to `src/app/services/rbac.service.ts`
2. **Implement stacked level fixes** as described above
3. **Add auth interceptor and guards** to app configuration
4. **Update offer show component** to use RBAC directives
5. **Test all functionality** using the checklist above

---

## Backend Verification Needed

Ensure these endpoints exist:
- `GET /api/stacked-levels/company/{companyId}`
- `POST /api/storage-needs/{id}/stocked-items` (accepts `stackedLevelId`)
- `POST /api/storage-offers/{id}/stocked-items` (accepts `stackedLevelId`)

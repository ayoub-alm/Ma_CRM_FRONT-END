import { Component, OnInit} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatChip, MatChipListbox} from "@angular/material/chips";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatCard, MatCardContent, MatCardTitle} from "@angular/material/card";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatDivider} from "@angular/material/divider";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatTab, MatTabGroup, MatTabLabel} from "@angular/material/tabs";
import {MatTooltip} from "@angular/material/tooltip";
import {MatDialog} from "@angular/material/dialog";
import {MatDrawerContainer} from "@angular/material/sidenav";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {BehaviorSubject, catchError, of, tap} from "rxjs";
import {TrackingLogComponent} from "../../../utils/tracking-log/tracking-log.component";
import {GeneralInfosComponent} from "../../../utils/general-infos/general-infos.component";
import {UserModel} from "../../../models/super-admin/user.model";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {UserService} from "../../../services/super-admin/user.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserResponseDto} from '../../../dtos/response/super-admin-responseDtos/user.response.dto';
import {RightsResponseDto} from '../../../dtos/response/super-admin-responseDtos/rights.response.dto';
import {UserMapper} from "../../../mappers/super-admin_mappers/user.mapper";
import {UserCreatEditComponent} from "../user-creat-edit/user-creat-edit.component";

@Component({
  selector: 'app-user-show',
  standalone: true,
    imports: [
        MatIcon,
        MatButton,
        MatCardTitle,
        MatCard,
        MatCardContent,
        MatDivider,
        NgIf,
        NgForOf,
        AsyncPipe,
        MatChip,
        MatTabGroup,
        MatTab,
        MatTabLabel,
        RouterLink,
        MatMenu,
        MatMenuTrigger,
        MatMenuItem,
        MatTooltip,
        MatIconButton,
        MatDrawerContainer,
        GeneralInfosComponent
    ],
  templateUrl: './user-show.component.html',
  styleUrl: './user-show.component.css'
})
export class UserShowComponent implements OnInit {
  user: BehaviorSubject<UserResponseDto> = new BehaviorSubject<UserResponseDto>({} as UserResponseDto);
  isLoading = true;

  constructor(
    public router: Router,
    private activeRouter: ActivatedRoute,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private bottomSheet: MatBottomSheet
  ) {
  }

  ngOnInit() {
    const userId: number = this.activeRouter.snapshot.params['id'];
    this.userService.getUserById(userId).pipe(
        tap(data => {
          this.user.next(data);
          this.isLoading = false;
        }),
        catchError((err) => {
          this.isLoading = false;
          this.snackBar.open("Erreur de téléchargement de données", "ok", {duration: 3000});
          return of(null);
        })).subscribe();
  }

  editUser(): void {
    const userData = this.user.getValue();
    if (userData && userData.id) {
      // Convert UserResponseDto to UserModel using mapper
      const userModel = UserMapper.fromDto(userData);
      this.dialog.open(UserCreatEditComponent, {
        width: '800px',
        maxWidth: '90vw',
        data: userModel
      }).afterClosed().subscribe(result => {
        if (result) {
          // Reload user data after successful edit
          this.ngOnInit();
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/super-admin/users']);
  }

  getDefaultAvatar(): string {
    const name = this.user.getValue()?.name || 'U';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0ea5e9&color=fff&size=128`;
  }

  getLogoUrl(): string {
    const logo = this.user.getValue()?.logo;
    if (logo && logo.trim() !== '') {
      return logo;
    }
    return this.getDefaultAvatar();
  }

  openTrackingLog(): void {
    const userData = this.user.getValue();
    if (userData && userData.id) {
      const entityType = 'com.sales_scout.entity.UserEntity';
      const entityId = userData.id;
      this.bottomSheet.open(TrackingLogComponent, {
        data: { entityType, entityId }
      });
    }
  }

  // Check if any rights have a companyId
  hasCompanyRights(rights: RightsResponseDto[] | undefined): boolean {
    if (!rights || rights.length === 0) {
      return false;
    }
    return rights.some(right => right.companyId != null);
  }

  // Get rights without companyId (global rights)
  getGlobalRights(rights: RightsResponseDto[] | undefined): RightsResponseDto[] {
    if (!rights || rights.length === 0) {
      return [];
    }
    return rights.filter(right => right.companyId == null);
  }

  // Group rights by company
  groupRightsByCompany(rights: RightsResponseDto[] | undefined): Array<{companyId: number | null, companyName: string, rights: RightsResponseDto[]}> {
    if (!rights || rights.length === 0) {
      return [];
    }

    const userData = this.user.getValue();
    const companyMap = new Map<number | null, RightsResponseDto[]>();
    
    // Group rights by companyId
    rights.forEach(right => {
      if (right.companyId != null) {
        if (!companyMap.has(right.companyId)) {
          companyMap.set(right.companyId, []);
        }
        companyMap.get(right.companyId)!.push(right);
      }
    });

    // Convert to array with company names
    const result: Array<{companyId: number | null, companyName: string, rights: RightsResponseDto[]}> = [];
    
    companyMap.forEach((rightsList, companyId) => {
      // Try to find company name from user's companies
      const company = userData?.companies?.find(c => c.id === companyId);
      const companyName = company?.name || `Entreprise #${companyId}`;
      
      result.push({
        companyId: companyId,
        companyName: companyName,
        rights: rightsList
      });
    });

    // Sort by company name
    return result.sort((a, b) => a.companyName.localeCompare(b.companyName));
  }
}

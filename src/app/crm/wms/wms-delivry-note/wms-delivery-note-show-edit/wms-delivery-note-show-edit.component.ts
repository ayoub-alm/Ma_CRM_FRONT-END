import {Component, OnInit} from '@angular/core';
import {StorageDeliveryNoteService} from '../../../../../services/crm/wms/storage.delivery.note.service';
import {BehaviorSubject, finalize, tap} from 'rxjs';
import {StorageDeliveryNoteResponseDto} from '../../../../../dtos/response/crm/storage.delivery.note.response.dto';
import {ActivatedRoute, Router} from '@angular/router';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatCard, MatCardContent} from '@angular/material/card';
import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {UploadFileComponent} from '../../../../utils/upload-file/upload-file.component';
import {GeneralInfosComponent} from '../../../../utils/general-infos/general-infos.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {StorageInvoiceService} from '../../../../../services/crm/wms/storage.invoice.service';
import {MatDialog} from '@angular/material/dialog';
import {ModificationRequestDialogComponent} from '../modification-request-dialog/modification-request-dialog.component';

@Component({
  selector: 'app-wms-delivery-note-show-edit',
  standalone: true,
  imports: [
    MatButton,
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatCard,
    MatCardContent,
    NgForOf,
    DatePipe,
    GeneralInfosComponent,
    MatMenuTrigger,
    MatIconButton,
    NgIf,
    NgClass
  ],
  templateUrl: './wms-delivery-note-show-edit.component.html',
  styleUrl: './wms-delivery-note-show-edit.component.css'
})
export class WmsDeliveryNoteShowEditComponent implements OnInit {
  isEditing: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(true);
  deliveryNote: BehaviorSubject<StorageDeliveryNoteResponseDto> = new BehaviorSubject<StorageDeliveryNoteResponseDto>({} as StorageDeliveryNoteResponseDto);

  constructor(private deliveryNoteService: StorageDeliveryNoteService, private activeRouter: ActivatedRoute,
              public router: Router, private snackBar: MatSnackBar, private storageInvoiceService: StorageInvoiceService,
              private dialog: MatDialog,) {
  }

  ngOnInit() {
    this.loadDeliveryNote();
  }

  loadDeliveryNote() {
    const storageDeliveryNoteId: number = this.activeRouter.snapshot.params['id'];
    this.deliveryNoteService.getStorageDeliveryNoteById(storageDeliveryNoteId).pipe(tap(storageDeliveryNote => {
      this.deliveryNote.next(storageDeliveryNote);
    })).subscribe()

    if (this.deliveryNote.getValue().status && this.deliveryNote.getValue().status.id > 1) {
      this.isEditing.next(false);
    }
  }


  updateProvisionQuantity(item: any, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const quantity = +inputElement.value;

    this.deliveryNoteService
      .updateProvisionQuantity(this.deliveryNote.getValue().id, item.id, quantity)
      .subscribe({
        next: (res) => {
          this.deliveryNote.next(res); // Update local state
          this.snackBar.open('Quantité de prestation mise à jour ✅', 'Fermer', {duration: 3000});
        },
        error: (err) => {
          console.error('Error updating provision quantity', err);
          this.snackBar.open('Erreur lors de la mise à jour de la prestation ❌', 'Fermer', {duration: 3000});
        }
      });
  }

  updateUnloadingQuantity(item: any, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const quantity = +inputElement.value;

    this.deliveryNoteService
      .updateUnloadingQuantity(this.deliveryNote.getValue().id, item.id, quantity)
      .subscribe({
        next: (res) => {
          this.deliveryNote.next(res);
          this.snackBar.open('Quantité de dépotage mise à jour ✅', 'Fermer', {duration: 3000});
        },
        error: (err) => {
          console.error('Error updating unloading quantity', err);
          this.snackBar.open('Erreur lors de la mise à jour du dépotage ❌', 'Fermer', {duration: 3000});
        }
      });
  }

  updateRequirementQuantity(item: any, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const quantity = +inputElement.value;

    this.deliveryNoteService
      .updateRequirementQuantity(this.deliveryNote.getValue().id, item.id, quantity)
      .subscribe({
        next: (res) => {
          this.deliveryNote.next(res);
          this.snackBar.open('Quantité de service mise à jour ✅', 'Fermer', {duration: 3000});
        },
        error: (err) => {
          console.error('Error updating requirement quantity', err);
          this.snackBar.open('Erreur lors de la mise à jour du service ❌', 'Fermer', {duration: 3000});
        }
      });
  }

  /**
   * this function allows to create invoice from delivery note
   * @constructor
   */
  CreateStorageInvoice(): void {
    this.storageInvoiceService.createStorageInvoiceByDeliveryNoteId(this.deliveryNote.getValue().id)
      .pipe(
        tap(storageInvoice => {
          this.snackBar.open('Facture Créé avec success ✅', 'Fermer', {duration: 3000});
        }))
      .subscribe({
        error: (err) => {
          console.error('Error updating requirement quantity', err);
          this.snackBar.open('Erreur lors de la mise à jour du service ❌', 'Fermer', {duration: 3000});
        }
      })
  }

  onCreateModificationRequest() {
    const dialogRef = this.dialog.open(ModificationRequestDialogComponent, {
      data: this.deliveryNote.getValue(),
      maxWidth: '100%',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Perform actions with the result, e.g., refresh the view or show a snackbar
        this.snackBar.open('Modification request submitted', 'Close', {
          duration: 3000
        });
        this.loadDeliveryNote();
      }
    });
  }

  /**
   *
   * @param requestId
   * @constructor
   */
  OnValidateUpdateRequest(requestId: number) {
    const deliveryNote = this.deliveryNote.getValue();
    const invoiceId = deliveryNote.storageInvoiceResponseDtos?.[0]?.id;
    const deliveryNoteId = deliveryNote?.id;

    if (deliveryNoteId && invoiceId) {
      this.storageInvoiceService
        .updateStorageInvoiceFromDeliveryNoteUpdateRequest(invoiceId, deliveryNoteId, requestId)
        .pipe(
          finalize(() => {
            // You can stop a loading spinner here if used
          })
        )
        .subscribe({
          next: () => {
            this.snackBar.open('Facture mise à jour avec succès.', 'Fermer', {
              duration: 3000,
              panelClass: ['snackbar-success']
            });
            this.loadDeliveryNote();
          },
          error: () => {
            this.snackBar.open('Erreur lors de la mise à jour de la facture.', 'Fermer', {
              duration: 3000,
              panelClass: ['snackbar-error']
            });
          }
        });
    } else {
      this.snackBar.open('Informations de la facture ou du bon de livraison manquantes.', 'Fermer', {
        duration: 3000,
        panelClass: ['snackbar-warning']
      });
    }

  }

  getRequestStatus(itemStatus: number): string {
    switch (itemStatus) {
      case 0:
        return "En attente de traitement";
      case 1:
        return "En cours de traitement";
      case 2:
        return "Traitée avec succès";
      case 3:
        return "Rejetée";
      default:
        return "Statut inconnu";
    }
  }

}

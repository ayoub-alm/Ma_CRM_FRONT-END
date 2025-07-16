  import {Component, Input, Output} from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { MatButton } from '@angular/material/button';
  import { MatSnackBar } from '@angular/material/snack-bar';
  import { StorageContractService } from '../../../services/crm/wms/storage.contract.service';
  import { EventEmitter } from '@angular/core';

  @Component({
    selector: 'app-upload-file',
    standalone: true,
    imports: [CommonModule, MatButton],
    templateUrl: './upload-file.component.html',
    styleUrls: ['./upload-file.component.css']
  })
  export class UploadFileComponent {
    @Input() contractId!: number;
    @Output() uploadCompleted:EventEmitter<any> = new EventEmitter<any>();
    selectedFile: File | null = null;
    isDragging = false;
    uploadedUrl: string | null = null;

    constructor(
      private contractService: StorageContractService,
      private snackBar: MatSnackBar
    ) {}

    onFileSelected(event: Event): void {
      const input = event.target as HTMLInputElement;
      const file = input.files?.[0];

      if (file) {
        this.uploadFile(file);
      }
    }

    onDragOver(event: DragEvent): void {
      event.preventDefault();
      this.isDragging = true;
    }

    onDragLeave(event: DragEvent): void {
      event.preventDefault();
      this.isDragging = false;
    }

    onDrop(event: DragEvent): void {
      event.preventDefault();
      this.isDragging = false;

      const file = event.dataTransfer?.files?.[0];
      if (file) {
        this.uploadFile(file);
      }
    }

    uploadFile(file: File): void {
      if (!this.contractId) return;
      this.selectedFile = file;
      this.contractService.uploadContractPdf(this.contractId, file).subscribe({
        next: (url) => {
          this.uploadedUrl = url;
          this.snackBar.open('Contrat PDF téléversé avec succès ✅', 'Fermer', { duration: 3000 });
          this.uploadCompleted.emit(true);
        },
        error: () => {
          this.snackBar.open('Erreur lors du téléversement du contrat PDF ❌', 'Fermer', { duration: 3000 });
          this.uploadCompleted.emit(false);
        },
      });
    }
  }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ContractDTO} from './contract.dto';
import {environment} from '../../environments/environment';
import {MatSnackBar} from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root'
})
export class PrintService {
  private apiUrl = environment.baseUrl+'/api/print';

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

  generateContractById(contractId: number) {
    this.http.get(`${this.apiUrl}/generate-contract/${contractId}`, { responseType: 'blob' }).subscribe(blob => {
      this.downloadFile(blob, 'contrat'+Date.now()+'.docx');
    });
  }



  generateInvoiceById(invoiceId: number) {
    this.http.get(`${this.apiUrl}/invoice/${invoiceId}`, { responseType: 'blob' }).subscribe(blob => {
      this.downloadFile(blob, 'invoice'+Date.now()+'.docx');
    });
  }


  generateContract(contractDTO: ContractDTO) {
    this.http.post(`http://127.0.0.1:5000/generate_contract`,contractDTO, { responseType: 'blob' }).subscribe(blob => {
      this.downloadFile(blob, 'contrat'+Date.now()+'.docx');
    });
  }






  generatePdf() {
    this.http.get(`${this.apiUrl}/generate-pdf`, { responseType: 'blob' }).subscribe(blob => {
      this.downloadFile(blob, 'contrat.docx');
    });
  }

  /**
   * Request DOCX generation for a Storage Offer and download the file
   * @param offerRef UUID of the storage offer
   */
  downloadStorageOfferDoc(offerRef: string): void {
    const url = `${this.apiUrl}/offer/${offerRef}`;

    this.http.get(url, { responseType: 'blob' }).subscribe(blob => {
      this.downloadFile(blob, 'Offer.docx');
    }, error => {
      console.error('Error downloading DOCX:', error);
    });
  }


  generateContractAnnexe(contractAnnexeId: number): void {
    const url = `${this.apiUrl}/contract-annexe/${contractAnnexeId}`;
    this.http.get(url, { responseType: 'blob' }).subscribe(blob => {
      this.downloadFile(blob, 'Annexe.docx');
    }, error => {
      console.error('Error downloading DOCX:', error);
    });
  }

  generateStorageCreditNote(creditNoteId: number): void {
    const url = `${this.apiUrl}/credit-note/${creditNoteId}`;
    this.http.get(url, { responseType: 'blob' }).subscribe(blob => {
      this.downloadFile(blob, 'Avoire.docx');
    }, error => {
      console.error('Error downloading DOCX:', error);
    });
  }

  private downloadFile(blob: Blob, fileName: string) {
    this.snackBar.open("Le téléchargement va commencer dans quelques secondes...", "ok", {duration:3000})
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}

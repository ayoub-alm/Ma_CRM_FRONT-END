import {Component, inject} from '@angular/core';
import {MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {MatListModule} from '@angular/material/list';

@Component({
  selector: 'app-tracking-log',
  standalone: true,
  imports: [MatListModule],
  templateUrl: './tracking-log.component.html',
  styleUrl: './tracking-log.component.css'
})
export class TrackingLogComponent {
  private _bottomSheetRef =
    inject<MatBottomSheetRef<TrackingLogComponent>>(MatBottomSheetRef);

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}

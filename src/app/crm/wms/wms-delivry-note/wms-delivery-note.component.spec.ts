import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WmsDeliveryNoteComponent } from './wms-delivery-note.component';

describe('WmsDeliveryNoteComponent', () => {
  let component: WmsDeliveryNoteComponent;
  let fixture: ComponentFixture<WmsDeliveryNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WmsDeliveryNoteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WmsDeliveryNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

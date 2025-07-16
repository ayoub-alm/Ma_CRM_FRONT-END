import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WmsDeliveryNoteCreateComponent } from './wms-delivery-note-create.component';

describe('WmsDeliveryNoteCreateComponent', () => {
  let component: WmsDeliveryNoteCreateComponent;
  let fixture: ComponentFixture<WmsDeliveryNoteCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WmsDeliveryNoteCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WmsDeliveryNoteCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WmsDeliveryNoteShowEditComponent } from './wms-delivery-note-show-edit.component';

describe('WmsDeliveryNoteShowEditComponent', () => {
  let component: WmsDeliveryNoteShowEditComponent;
  let fixture: ComponentFixture<WmsDeliveryNoteShowEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WmsDeliveryNoteShowEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WmsDeliveryNoteShowEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

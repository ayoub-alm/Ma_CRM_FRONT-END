import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdatePaymentDialogComponent } from './add-update-payment-dialog.component';

describe('AddUpdatePaymentDialogComponent', () => {
  let component: AddUpdatePaymentDialogComponent;
  let fixture: ComponentFixture<AddUpdatePaymentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUpdatePaymentDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdatePaymentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

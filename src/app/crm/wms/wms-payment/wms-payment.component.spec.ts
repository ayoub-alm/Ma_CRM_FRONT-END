import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WmsPaymentComponent } from './wms-payment.component';

describe('WmsPaymentComponent', () => {
  let component: WmsPaymentComponent;
  let fixture: ComponentFixture<WmsPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WmsPaymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WmsPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

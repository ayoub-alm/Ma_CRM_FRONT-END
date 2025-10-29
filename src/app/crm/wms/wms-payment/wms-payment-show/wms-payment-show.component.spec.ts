import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WmsPaymentShowComponent } from './wms-payment-show.component';

describe('WmsPaymentShowComponent', () => {
  let component: WmsPaymentShowComponent;
  let fixture: ComponentFixture<WmsPaymentShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WmsPaymentShowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WmsPaymentShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

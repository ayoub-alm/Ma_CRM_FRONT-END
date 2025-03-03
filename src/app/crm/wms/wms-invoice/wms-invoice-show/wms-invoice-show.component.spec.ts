import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WmsInvoiceShowComponent } from './wms-invoice-show.component';

describe('WmsInvoiceShowComponent', () => {
  let component: WmsInvoiceShowComponent;
  let fixture: ComponentFixture<WmsInvoiceShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WmsInvoiceShowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WmsInvoiceShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WmsInvoiceComponent } from './wms-invoice.component';

describe('WmsInvoiceComponent', () => {
  let component: WmsInvoiceComponent;
  let fixture: ComponentFixture<WmsInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WmsInvoiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WmsInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

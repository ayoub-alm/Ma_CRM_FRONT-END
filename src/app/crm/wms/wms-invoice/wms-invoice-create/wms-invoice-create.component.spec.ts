import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WmsInvoiceCreateComponent } from './wms-invoice-create.component';

describe('WmsInvoiceCreateComponent', () => {
  let component: WmsInvoiceCreateComponent;
  let fixture: ComponentFixture<WmsInvoiceCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WmsInvoiceCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WmsInvoiceCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

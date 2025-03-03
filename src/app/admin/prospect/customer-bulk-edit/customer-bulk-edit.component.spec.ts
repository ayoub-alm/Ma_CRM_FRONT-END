import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerBulkEditComponent } from './customer-bulk-edit.component';

describe('CustomerBulkEditComponent', () => {
  let component: CustomerBulkEditComponent;
  let fixture: ComponentFixture<CustomerBulkEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerBulkEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerBulkEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

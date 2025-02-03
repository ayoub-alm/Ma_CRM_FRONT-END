import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWmsPricingComponent } from './add-wms-pricing.component';

describe('AddWmsPricingComponent', () => {
  let component: AddWmsPricingComponent;
  let fixture: ComponentFixture<AddWmsPricingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddWmsPricingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddWmsPricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

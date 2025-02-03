import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WmsPricingComponent } from './wms-pricing.component';

describe('WmsPricingComponent', () => {
  let component: WmsPricingComponent;
  let fixture: ComponentFixture<WmsPricingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WmsPricingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WmsPricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

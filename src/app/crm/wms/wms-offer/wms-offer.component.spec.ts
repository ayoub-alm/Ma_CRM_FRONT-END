import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WmsOfferComponent } from './wms-offer.component';

describe('WmsOffreComponent', () => {
  let component: WmsOfferComponent;
  let fixture: ComponentFixture<WmsOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WmsOfferComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WmsOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

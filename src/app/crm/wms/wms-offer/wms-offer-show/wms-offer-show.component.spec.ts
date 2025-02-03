import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WmsOfferShowComponent } from './wms-offer-show.component';

describe('WmsOfferShowComponent', () => {
  let component: WmsOfferShowComponent;
  let fixture: ComponentFixture<WmsOfferShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WmsOfferShowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WmsOfferShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

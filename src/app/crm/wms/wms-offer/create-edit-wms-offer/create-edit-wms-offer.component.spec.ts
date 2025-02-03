import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditWmsOfferComponent } from './create-edit-wms-offer.component';

describe('CreateEditWmsOfferComponent', () => {
  let component: CreateEditWmsOfferComponent;
  let fixture: ComponentFixture<CreateEditWmsOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEditWmsOfferComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEditWmsOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

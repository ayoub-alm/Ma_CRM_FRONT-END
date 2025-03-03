import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WmsContractShowComponent } from './wms-contract-show.component';

describe('WmsContractShowComponent', () => {
  let component: WmsContractShowComponent;
  let fixture: ComponentFixture<WmsContractShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WmsContractShowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WmsContractShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

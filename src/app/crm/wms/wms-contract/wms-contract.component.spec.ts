import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WmsContractComponent } from './wms-contract.component';

describe('WmsContractComponent', () => {
  let component: WmsContractComponent;
  let fixture: ComponentFixture<WmsContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WmsContractComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WmsContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

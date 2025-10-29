import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WmsAssetComponent } from './wms-asset.component';

describe('WmsAssetComponent', () => {
  let component: WmsAssetComponent;
  let fixture: ComponentFixture<WmsAssetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WmsAssetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WmsAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

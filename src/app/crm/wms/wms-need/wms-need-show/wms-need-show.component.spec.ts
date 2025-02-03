import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WmsNeedShowComponent } from './wms-need-show.component';

describe('WmsNeedShowComponent', () => {
  let component: WmsNeedShowComponent;
  let fixture: ComponentFixture<WmsNeedShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WmsNeedShowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WmsNeedShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

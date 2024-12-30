import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WmsNeedComponent } from './wms-need.component';

describe('WmsNeedComponent', () => {
  let component: WmsNeedComponent;
  let fixture: ComponentFixture<WmsNeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WmsNeedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WmsNeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

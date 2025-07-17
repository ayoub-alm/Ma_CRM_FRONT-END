import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WmsNeedCreateComponent } from './wms-need-create.component';

describe('WmsNeedCreateComponent', () => {
  let component: WmsNeedCreateComponent;
  let fixture: ComponentFixture<WmsNeedCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WmsNeedCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WmsNeedCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

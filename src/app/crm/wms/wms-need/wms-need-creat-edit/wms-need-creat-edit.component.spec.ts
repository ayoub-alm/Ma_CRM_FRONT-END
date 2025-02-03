import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WmsNeedCreatEditComponent } from './wms-need-creat-edit.component';

describe('WmsNeedCreatEditComponent', () => {
  let component: WmsNeedCreatEditComponent;
  let fixture: ComponentFixture<WmsNeedCreatEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WmsNeedCreatEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WmsNeedCreatEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

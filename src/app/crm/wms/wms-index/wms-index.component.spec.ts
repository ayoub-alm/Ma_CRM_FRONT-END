import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WmsIndexComponent } from './wms-index.component';

describe('WmsIndexComponent', () => {
  let component: WmsIndexComponent;
  let fixture: ComponentFixture<WmsIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WmsIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WmsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TmsNeedShowComponent } from './tms-need-show.component';

describe('TmsNeedShowComponent', () => {
  let component: TmsNeedShowComponent;
  let fixture: ComponentFixture<TmsNeedShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TmsNeedShowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TmsNeedShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

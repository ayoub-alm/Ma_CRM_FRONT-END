import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TmsNeedComponent } from './tms-need.component';

describe('TmsNeedComponent', () => {
  let component: TmsNeedComponent;
  let fixture: ComponentFixture<TmsNeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TmsNeedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TmsNeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

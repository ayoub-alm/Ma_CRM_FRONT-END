import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeedComponent } from './need.component';

describe('NeedComponent', () => {
  let component: NeedComponent;
  let fixture: ComponentFixture<NeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NeedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

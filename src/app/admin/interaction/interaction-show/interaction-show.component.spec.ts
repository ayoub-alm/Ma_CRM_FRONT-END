import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractionShowComponent } from './interaction-show.component';

describe('InteractionShowComponent', () => {
  let component: InteractionShowComponent;
  let fixture: ComponentFixture<InteractionShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InteractionShowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InteractionShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

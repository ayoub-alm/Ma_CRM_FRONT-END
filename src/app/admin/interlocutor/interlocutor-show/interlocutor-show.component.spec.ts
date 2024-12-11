import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterlocutorShowComponent } from './interlocutor-show.component';

describe('InterlocutorShowComponent', () => {
  let component: InterlocutorShowComponent;
  let fixture: ComponentFixture<InterlocutorShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterlocutorShowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterlocutorShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

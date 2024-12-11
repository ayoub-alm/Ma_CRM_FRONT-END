import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateInterlocutorComponent } from './add-update-interlocutor.component';

describe('AddUpdateInterlocutorComponent', () => {
  let component: AddUpdateInterlocutorComponent;
  let fixture: ComponentFixture<AddUpdateInterlocutorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUpdateInterlocutorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateInterlocutorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

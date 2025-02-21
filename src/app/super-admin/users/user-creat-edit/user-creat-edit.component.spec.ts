import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCreatEditComponent } from './user-creat-edit.component';

describe('UserCreatEditComponent', () => {
  let component: UserCreatEditComponent;
  let fixture: ComponentFixture<UserCreatEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCreatEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCreatEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InLineEditInputComponent } from './in-line-edit-input.component';

describe('InLineEditInputComponent', () => {
  let component: InLineEditInputComponent;
  let fixture: ComponentFixture<InLineEditInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InLineEditInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InLineEditInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

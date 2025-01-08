import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditInteractionDialogComponent } from './add-edit-interaction-dialog.component';

describe('AddEditInteractionDialogComponent', () => {
  let component: AddEditInteractionDialogComponent;
  let fixture: ComponentFixture<AddEditInteractionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditInteractionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditInteractionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

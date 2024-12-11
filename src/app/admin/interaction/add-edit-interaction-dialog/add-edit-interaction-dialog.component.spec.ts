import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditIntractionDialogComponent } from './add-edit-interaction-dialog.component';

describe('AddEditIntractionDialogComponent', () => {
  let component: AddEditIntractionDialogComponent;
  let fixture: ComponentFixture<AddEditIntractionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditIntractionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditIntractionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

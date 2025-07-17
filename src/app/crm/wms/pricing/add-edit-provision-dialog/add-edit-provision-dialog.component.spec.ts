import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditProvisionDialogComponent } from './add-edit-provision-dialog.component';

describe('AddEditProvisionDialogComponent', () => {
  let component: AddEditProvisionDialogComponent;
  let fixture: ComponentFixture<AddEditProvisionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditProvisionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditProvisionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

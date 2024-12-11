import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProspectDialogComponent } from './add-prospect-dialog.component';

describe('AddProspectDialogComponent', () => {
  let component: AddProspectDialogComponent;
  let fixture: ComponentFixture<AddProspectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProspectDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProspectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

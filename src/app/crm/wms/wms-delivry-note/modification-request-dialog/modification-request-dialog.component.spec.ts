import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificationRequestDialogComponent } from './modification-request-dialog.component';

describe('ModificationRequestDialogComponent', () => {
  let component: ModificationRequestDialogComponent;
  let fixture: ComponentFixture<ModificationRequestDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModificationRequestDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificationRequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

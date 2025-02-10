import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateCompanyComponent } from './add-update-company.component';

describe('AddUpdateCompanyComponent', () => {
  let component: AddUpdateCompanyComponent;
  let fixture: ComponentFixture<AddUpdateCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUpdateCompanyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

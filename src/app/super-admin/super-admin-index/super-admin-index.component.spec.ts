import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminIndexComponent } from './super-admin-index.component';

describe('SuperAdminIndexComponent', () => {
  let component: SuperAdminIndexComponent;
  let fixture: ComponentFixture<SuperAdminIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperAdminIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperAdminIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

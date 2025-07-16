import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStockedItemComponent } from './add-stocked-item.component';

describe('AddStockedItemComponent', () => {
  let component: AddStockedItemComponent;
  let fixture: ComponentFixture<AddStockedItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddStockedItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddStockedItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

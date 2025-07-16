import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStorageContractDailogComponent } from './create-storage-contract-dailog.component';

describe('CreateStorageContractDailogComponent', () => {
  let component: CreateStorageContractDailogComponent;
  let fixture: ComponentFixture<CreateStorageContractDailogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateStorageContractDailogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateStorageContractDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

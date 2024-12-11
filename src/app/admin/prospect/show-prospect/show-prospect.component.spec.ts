import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowProspectComponent } from './show-prospect.component';

describe('ShowProspectComponent', () => {
  let component: ShowProspectComponent;
  let fixture: ComponentFixture<ShowProspectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowProspectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowProspectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

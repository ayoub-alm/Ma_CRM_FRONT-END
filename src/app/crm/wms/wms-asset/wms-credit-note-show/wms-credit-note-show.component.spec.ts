import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WmsCreditNoteShowComponent } from './wms-credit-note-show.component';

describe('WmsCreditNoteShowComponent', () => {
  let component: WmsCreditNoteShowComponent;
  let fixture: ComponentFixture<WmsCreditNoteShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WmsCreditNoteShowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WmsCreditNoteShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

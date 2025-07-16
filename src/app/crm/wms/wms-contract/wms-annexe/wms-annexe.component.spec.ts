import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WmsAnnexeComponent } from './wms-annexe.component';

describe('WmsAnnexeComponent', () => {
  let component: WmsAnnexeComponent;
  let fixture: ComponentFixture<WmsAnnexeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WmsAnnexeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WmsAnnexeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

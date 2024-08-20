import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LigneCarriereComponent } from './ligne-carriere.component';

describe('LigneCarriereComponent', () => {
  let component: LigneCarriereComponent;
  let fixture: ComponentFixture<LigneCarriereComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LigneCarriereComponent]
    });
    fixture = TestBed.createComponent(LigneCarriereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

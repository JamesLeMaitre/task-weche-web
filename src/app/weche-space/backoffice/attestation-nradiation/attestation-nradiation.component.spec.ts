import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttestationNradiationComponent } from './attestation-nradiation.component';

describe('AttestationNradiationComponent', () => {
  let component: AttestationNradiationComponent;
  let fixture: ComponentFixture<AttestationNradiationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AttestationNradiationComponent]
    });
    fixture = TestBed.createComponent(AttestationNradiationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

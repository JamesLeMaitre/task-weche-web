import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeAttestationComponent } from './demande-attestation.component';

describe('DemandeAttestationComponent', () => {
  let component: DemandeAttestationComponent;
  let fixture: ComponentFixture<DemandeAttestationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemandeAttestationComponent]
    });
    fixture = TestBed.createComponent(DemandeAttestationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

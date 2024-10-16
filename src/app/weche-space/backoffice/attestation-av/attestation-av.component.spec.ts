import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttestationAvComponent } from './attestation-av.component';

describe('AttestationAvComponent', () => {
  let component: AttestationAvComponent;
  let fixture: ComponentFixture<AttestationAvComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AttestationAvComponent]
    });
    fixture = TestBed.createComponent(AttestationAvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

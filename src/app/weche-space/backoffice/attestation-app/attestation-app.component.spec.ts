import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttestationAppComponent } from './attestation-app.component';

describe('AttestationAppComponent', () => {
  let component: AttestationAppComponent;
  let fixture: ComponentFixture<AttestationAppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AttestationAppComponent]
    });
    fixture = TestBed.createComponent(AttestationAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

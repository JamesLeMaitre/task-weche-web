import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignalerComponent } from './signaler.component';

describe('SignalerComponent', () => {
  let component: SignalerComponent;
  let fixture: ComponentFixture<SignalerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignalerComponent]
    });
    fixture = TestBed.createComponent(SignalerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeInfosComponent } from './demande-infos.component';

describe('DemandeInfosComponent', () => {
  let component: DemandeInfosComponent;
  let fixture: ComponentFixture<DemandeInfosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemandeInfosComponent]
    });
    fixture = TestBed.createComponent(DemandeInfosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortailComponent } from './portail.component';

describe('PortailComponent', () => {
  let component: PortailComponent;
  let fixture: ComponentFixture<PortailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortailComponent]
    });
    fixture = TestBed.createComponent(PortailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

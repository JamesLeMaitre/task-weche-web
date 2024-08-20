import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuContacterNousComponent } from './menu-contacter-nous.component';

describe('MenuContacterNousComponent', () => {
  let component: MenuContacterNousComponent;
  let fixture: ComponentFixture<MenuContacterNousComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenuContacterNousComponent]
    });
    fixture = TestBed.createComponent(MenuContacterNousComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

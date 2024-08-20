import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuConnexionComponent } from './menu-connexion.component';

describe('MenuConnexionComponent', () => {
  let component: MenuConnexionComponent;
  let fixture: ComponentFixture<MenuConnexionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenuConnexionComponent]
    });
    fixture = TestBed.createComponent(MenuConnexionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuAlloretraiteComponent } from './menu-alloretraite.component';

describe('MenuAlloretraiteComponent', () => {
  let component: MenuAlloretraiteComponent;
  let fixture: ComponentFixture<MenuAlloretraiteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenuAlloretraiteComponent]
    });
    fixture = TestBed.createComponent(MenuAlloretraiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuEngagementComponent } from './menu-engagement.component';

describe('MenuEngagementComponent', () => {
  let component: MenuEngagementComponent;
  let fixture: ComponentFixture<MenuEngagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenuEngagementComponent]
    });
    fixture = TestBed.createComponent(MenuEngagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

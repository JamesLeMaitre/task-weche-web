import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentModal2Component } from './document-modal2.component';

describe('DocumentModal2Component', () => {
  let component: DocumentModal2Component;
  let fixture: ComponentFixture<DocumentModal2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentModal2Component]
    });
    fixture = TestBed.createComponent(DocumentModal2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

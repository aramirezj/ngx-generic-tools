import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GTGenericEditorComponent } from './editar-generico.component';

describe('GTGenericEditorComponent', () => {
  let component: GTGenericEditorComponent;
  let fixture: ComponentFixture<GTGenericEditorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GTGenericEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GTGenericEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

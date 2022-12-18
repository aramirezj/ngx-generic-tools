import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GTEditarGenericoComponent } from './editar-generico.component';

describe('GTEditarGenericoComponent', () => {
  let component: GTEditarGenericoComponent;
  let fixture: ComponentFixture<GTEditarGenericoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GTEditarGenericoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GTEditarGenericoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

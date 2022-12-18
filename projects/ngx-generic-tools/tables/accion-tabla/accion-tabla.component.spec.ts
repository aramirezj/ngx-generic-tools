import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GTAccionTablaComponent } from './accion-tabla.component';

describe('GTAccionTablaComponent', () => {
  let component: GTAccionTablaComponent;
  let fixture: ComponentFixture<GTAccionTablaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GTAccionTablaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GTAccionTablaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

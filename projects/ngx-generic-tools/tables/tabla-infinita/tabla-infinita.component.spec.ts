import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GTTablaInfinitaComponent } from './tabla-infinita.component';

describe('GTTablaInfinitaComponent', () => {
  let component: GTTablaInfinitaComponent;
  let fixture: ComponentFixture<GTTablaInfinitaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GTTablaInfinitaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GTTablaInfinitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

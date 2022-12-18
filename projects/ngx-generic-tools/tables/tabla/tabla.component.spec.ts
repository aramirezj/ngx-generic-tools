import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GTTablaComponent } from './tabla.component';

describe('GTTablaComponent', () => {
  let component: GTTablaComponent;
  let fixture: ComponentFixture<GTTablaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GTTablaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GTTablaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GTBuscadorComponent } from './buscador.component';

describe('GTBuscadorComponent', () => {
  let component: GTBuscadorComponent;
  let fixture: ComponentFixture<GTBuscadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GTBuscadorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GTBuscadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

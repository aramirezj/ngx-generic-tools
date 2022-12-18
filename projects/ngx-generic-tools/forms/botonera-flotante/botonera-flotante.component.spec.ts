import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GTBotoneraComponent } from './botonera-flotante.component';

describe('GTBotoneraComponent', () => {
  let component: GTBotoneraComponent;
  let fixture: ComponentFixture<GTBotoneraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GTBotoneraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GTBotoneraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

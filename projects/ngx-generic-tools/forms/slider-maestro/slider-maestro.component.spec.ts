import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GTSliderMaestroComponent } from './slider-maestro.component';

describe('GTSliderMaestroComponent', () => {
  let component: GTSliderMaestroComponent;
  let fixture: ComponentFixture<GTSliderMaestroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GTSliderMaestroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GTSliderMaestroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
